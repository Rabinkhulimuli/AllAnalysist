export type DocumentStatusValue = 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface UploadedDocument {
  id: string;
  filename: string;
  status: DocumentStatusValue;
  error_message: string | null;
}

export interface IDocumentPipelineService {
  uploadFile(file: File): Promise<UploadedDocument>;
  getDocument(documentId: string): Promise<UploadedDocument>;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

export class DocumentPipelineService implements IDocumentPipelineService {
  async uploadFile(file: File): Promise<UploadedDocument> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/documents', { method: 'POST', body: formData });
    return handle<UploadedDocument>(res);
  }

  async getDocument(documentId: string): Promise<UploadedDocument> {
    const res = await fetch(`/api/documents/${documentId}`, { cache: 'no-store' });
    return handle<UploadedDocument>(res);
  }
}

export const documentPipelineService = new DocumentPipelineService();
