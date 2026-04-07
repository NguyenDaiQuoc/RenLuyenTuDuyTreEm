import express from "express";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import cors from "cors";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { GoogleGenAI } from "@google/genai";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  const PORT = 3000;

  // Stripe Webhook (must be before express.json())
  app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const stripeCustomerId = session.customer as string;
        const stripeSubId = session.subscription as string;

        if (userId) {
          const subscription = await stripe.subscriptions.retrieve(stripeSubId);
          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeCustomerId,
              subscriptionStatus: "premium",
              subscriptions: {
                create: {
                  stripeSubId,
                  plan: session.metadata?.plan || "monthly",
                  status: "active",
                  currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                }
              }
            }
          });
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.update({
          where: { stripeSubId: subscription.id },
          data: {
            status: subscription.status,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          }
        });
        
        if (subscription.status !== "active") {
          const sub = await prisma.subscription.findUnique({
            where: { stripeSubId: subscription.id },
            select: { userId: true }
          });
          if (sub) {
            await prisma.user.update({
              where: { id: sub.userId },
              data: { subscriptionStatus: "free" }
            });
          }
        }
        break;
      }
    }

    res.json({ received: true });
  });

  app.use(express.json());
  app.use(cors());

  // API: Create Checkout Session
  app.post("/api/stripe/create-checkout", async (req, res) => {
    const { userId, plan, email } = req.body;
    
    // Ensure user exists in Prisma
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { id: userId, email, name: email.split("@")[0] }
      });
    }

    const priceId = plan === "yearly" ? "price_yearly_id" : "price_monthly_id"; // Replace with real IDs

    try {
      const session = await stripe.checkout.sessions.create({
        customer_email: email,
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        subscription_data: {
          trial_period_days: 7,
        },
        success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/premium`,
        metadata: { userId: user.id, plan }
      });

      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API: Analytics Event
  app.post("/api/analytics/event", async (req, res) => {
    const { userId, type, data } = req.body;
    try {
      const event = await prisma.analyticsEvent.create({
        data: { userId, type, data: JSON.stringify(data) }
      });
      io.emit("analytics_event", event);
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API: Generate Parent Report
  app.get("/api/reports/:userId", async (req, res) => {
    const { userId } = req.params;
    const events = await prisma.analyticsEvent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    const prompt = `Generate a detailed parent report for a child's learning progress. 
    The child has completed the following activities: ${JSON.stringify(events)}.
    Focus on cognitive growth, areas of strength, and suggestions for improvement.
    Format the response in Markdown.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      res.json({ report: response.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
