"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MapPin, Moon } from "lucide-react";

import img1 from "@/assets/carousel/1.jpeg";
import img2 from "@/assets/carousel/2.jpeg";
import img3 from "@/assets/carousel/3.jpeg";

const images = [img1, img2, img3];

const GuestPage = () => {
  return (
    <div className="max-w-md mx-auto rounded-xl shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 space-y-1">
        <h1 className="font-semibold text-lg">Restaurant name</h1>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          <span>TTTM Vincom</span>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <Carousel>
          <CarouselContent>
            {images.map((src, i) => (
              <CarouselItem key={i}>
                <div className="relative w-full h-[220px]">
                  <Image src={src} alt="Food" fill className="object-cover" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      {/* Footer */}
      <div className="p-4 border-t space-y-3">
        <div className="flex items-center gap-2 text-gray-700">
          <Moon className="w-4 h-4" />
          <span>
            Chào buổi tối{" "}
            <span className="text-blue-500 font-medium">Admin User</span>
          </span>
          <span className="ml-auto text-gray-400 cursor-pointer">✎</span>
        </div>

        <div className="text-sm text-gray-600">
          Chúng tôi sẽ trả đồ cho bạn tại bàn:{" "}
          <span className="font-semibold text-black">A12</span>
        </div>

        {/* Interaction buttons */}
        {/* Interaction buttons */}
        <div className="grid grid-cols-3 gap-3">
          <div
            className="relative h-[96px] rounded-xl p-3 overflow-hidden"
            style={{
              background:
                "linear-gradient(123.68deg, rgb(255, 240, 232) 4.76%, rgb(255, 255, 255) 47.02%, rgb(224, 243, 255) 98.09%)",
            }}
          >
            <div className="text-sm font-medium text-gray-700 z-10 relative">
              Gọi thanh toán
            </div>
            <img
              src="https://o2o.ipos.vn/static/images/request_payment_2.png"
              alt="payment"
              className="absolute bottom-0 right-0 h-[70px]"
              style={{ borderBottomRightRadius: 12 }}
            />
          </div>

          <div
            className="relative h-[96px] rounded-xl p-3 overflow-hidden"
            style={{
              background:
                "linear-gradient(rgb(255, 240, 232) 0%, rgb(224, 255, 253) 100%)",
            }}
          >
            <div className="text-sm font-medium text-gray-700 z-10 relative">
              Gọi nhân viên
            </div>
            <img
              src="https://o2o.ipos.vn/static/images/bg-request_service.png"
              alt="service"
              className="absolute bottom-0 right-0 h-[70px]"
              style={{ borderBottomRightRadius: 12 }}
            />
          </div>

          <div
            className="relative h-[96px] rounded-xl p-3 overflow-hidden"
            style={{
              background:
                "linear-gradient(rgb(255, 241, 227) 0%, rgb(255, 255, 255) 53.5%, rgb(255, 252, 230) 100%)",
            }}
          >
            <div className="text-sm font-medium text-gray-700 z-10 relative">
              Đánh giá
            </div>
            <img
              src="https://o2o.ipos.vn/static/images/bg-rate.png"
              alt="rate"
              className="absolute bottom-0 right-0 h-[70px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestPage;
