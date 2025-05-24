import { Swiper } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const Carousel = ({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) => {
   return (
      <Swiper className='items-stretch mb-3'
         spaceBetween={20}
         slidesPerView={1}
         loop={true}
         modules={[Autoplay]}
         autoplay={{
            delay: 3000, // 3 seconds
            disableOnInteraction: false,
         }}
         breakpoints={{
            768: {
               slidesPerView: 2,
            },
            1024: {
               slidesPerView: 3,
               loop: false,
            },
         }}
         // onSlideChange={() => console.log('slide change')}
         onSwiper={(swiper) => console.log(swiper)}
      >
         {children}
      </Swiper>
   )
}

export default Carousel