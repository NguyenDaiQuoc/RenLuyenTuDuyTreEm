import * as monaco from 'monaco-editor';

// Configure Monaco Environment for Vite
// This fixes "Could not create web worker" error
if (typeof window !== 'undefined') {
  (window as any).MonacoEnvironment = {
    getWorkerUrl: function (_moduleId: any, label: string) {
      if (label === 'json') {
        return 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/language/json/json.worker.min.js';
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/language/css/css.worker.min.js';
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/language/html/html.worker.min.js';
      }
      if (label === 'typescript' || label === 'javascript') {
        return 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/language/typescript/ts.worker.min.js';
      }
      return 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/base/worker/workerMain.min.js';
    },
  };
}

export default monaco;
