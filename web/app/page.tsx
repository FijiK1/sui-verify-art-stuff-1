"use client";

import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";

const PACKAGE_ID = "0x459f8513c0224db340e254aa9e6039af25c93ab0037b16146b1f9b215457a97c"; 
const MODULE_NAME = "art_nft";
const FUNCTION_NAME = "mint";

export default function Home() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "checking" | "human" | "ai" | "minting" | "success">("idle");
  const [aiScore, setAiScore] = useState(0);

  //Xử lý khi chọn ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setStatus("idle");
    }
  };

  //call Backend check AI
  const handleCheckAI = async () => {
    if (!file) return;
    setStatus("checking");
  
    // Fake delay cho giống AI thật
    setTimeout(() => {
      setAiScore(0.05);
      setStatus("human"); // 
    }, 1500);
  };

  //call Ví Sui để Mint NFT
  const handleMint = () => {
    if (!account) return alert("Vui lòng kết nối ví!");
    setStatus("minting");
  
    const tx = new Transaction();
  
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
      arguments: [
        tx.pure.string("My Artwork"),
        tx.pure.string("Verified Human Art on Sui"),
        tx.pure.string("https://via.placeholder.com/150"),
      ],
    });
  
    signAndExecute(
      {
        transaction: tx,
       
      },
      {
        onSuccess: (result) => {
          console.log("Mint thành công:", result);
          setStatus("success");
          alert("Mint thành công! Check ví ngay.");
        },
        onError: (err) => {
          console.error("Mint error:", err);
          setStatus("human");
          alert("Lỗi khi Mint NFT");
        },
      }
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-blue-500">Sui Art Verifier</h1>
        <ConnectButton />
      </div>

      <div className="mt-10 flex flex-col items-center gap-6 bg-gray-800 p-10 rounded-xl shadow-xl">
        {/* Bước 1: Upload */}
        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-300">Upload tác phẩm của bạn</label>
          <input 
            type="file" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" 
          />
        </div>

        {/* Bước 2: Nút Check AI */}
        {status === "idle" && file && (
          <button 
            onClick={handleCheckAI}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-bold transition"
          >
            Kiểm tra AI ngay 🕵️
          </button>
        )}

        {/* Trạng thái: Đang check */}
        {status === "checking" && <p className="animate-pulse">Đang soi pixel... 🤖</p>}

        {/* Kết quả: Là AI */}
        {status === "ai" && (
          <div className="text-center p-4 border border-red-500 rounded bg-red-900/20">
            <h2 className="text-2xl font-bold text-red-500">PHÁT HIỆN AI! 🚨</h2>
            <p>Tỉ lệ AI: {(aiScore * 100).toFixed(1)}%</p>
            <p className="text-sm mt-2 text-gray-400">Bạn không được phép Mint NFT này.</p>
          </div>
        )}

        {/* Kết quả: Là Người -> Hiện nút Mint */}
        {status === "human" && (
          <div className="text-center p-4 border border-green-500 rounded bg-green-900/20">
            <h2 className="text-2xl font-bold text-green-400">XÁC THỰC THÀNH CÔNG ✅</h2>
            <p>Đây là tác phẩm của con người.</p>
            <button 
              onClick={handleMint}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-full font-bold shadow-lg transform hover:scale-105 transition"
            >
              MINT NFT ON SUI 🚀
            </button>
          </div>
        )}

        {/* Trạng thái: Minting */}
        {status === "minting" && <p className="text-yellow-400">Đang ghi vào Blockchain... Vui lòng xác nhận trên ví...</p>}

        {/* Trạng thái: Success */}
        {status === "success" && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-yellow-400">🎉 CHÚC MỪNG! 🎉</h2>
            <p>Tác phẩm đã được bảo vệ vĩnh viễn trên Sui.</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-blue-400 underline">Làm cái mới</button>
          </div>
        )}
      </div>
    </main>
  );
}
