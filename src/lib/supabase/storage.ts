import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export interface UploadedEvidence {
  url: string;
  path: string;
  fileType: string;
  fileSizeKb: number;
}

/**
 * Uploads evidence files to the `evidence` Supabase Storage bucket (see
 * supabase/migrations/0003_storage_evidence_bucket.sql) and returns public
 * URLs to attach to a scam report. Runs client-side, ahead of the POST to
 * /api/reports, so the API route only ever stores URLs, never raw files.
 */
export async function uploadEvidenceFiles(files: File[], reportDraftId: string): Promise<UploadedEvidence[]> {
  const supabase = createSupabaseBrowserClient();
  const uploads: UploadedEvidence[] = [];

  for (const file of files) {
    const path = `${reportDraftId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    const { error } = await supabase.storage.from('evidence').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) throw error;

    const { data } = supabase.storage.from('evidence').getPublicUrl(path);
    uploads.push({
      url: data.publicUrl,
      path,
      fileType: file.type,
      fileSizeKb: Math.round(file.size / 1024),
    });
  }

  return uploads;
}
