import { supabase } from '@/supabase';

export const defaultImage = 'https://ionicframework.com/docs/img/demos/card-media.png';

export const getSignedObjectUrl = async (bucket: string, bucketUrl: string) => {
    return await supabase
      .storage
      .from(bucket)
      .createSignedUrl(bucketUrl, 60, {
        transform: {
          width: 100,
          height: 100,
        }
    })
};

export const getBucketUrlFromTable = async (table: string, id: number) => {
    return await supabase
      .from(table)
      .select('image_url')
      .eq('id', id)
      .single()
}