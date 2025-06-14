import Image from 'next/image';
import ImageUploadClient from '@/components/ImageUploadClient';

export default function Home() {
  return (
    <div className="container w-100">
      <div className="w-100 my-4 d-flex justify-content-center" data-aos="fade-down">
        <div className='py-4 rounded-5'>
        <Image
          src="/logo_2x.webp"
          alt="Описание"
          width={120}
          height={37}
          sizes="(max-width: 300px) 100vw, 300px"
        />
        </div>
      </div>
      <ImageUploadClient />
    </div>
  );
}
