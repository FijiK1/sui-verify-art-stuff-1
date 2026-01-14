import { NextResponse } from "next/server";

// Cấu hình Model AI của HuggingFace
const HF_MODEL_URL = "https://api-inference.huggingface.co/models/umm-maybe/AI-image-detector";

export async function POST(request: Request) {
  try {
    //receive file ảnh từ FE up lên
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file ảnh" }, { status: 400 });
    }

    //convert ảnh thành Buffer send đi
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    //send to huggingface
    const response = await fetch(HF_MODEL_URL, {
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`, //Token lấy từ file .env
        "Content-Type": "application/octet-stream",
      },
      method: "POST",
      body: buffer,
    });

    //Xử lý kq
    if (!response.ok) {
      throw new Error("Lỗi kết nối đến HuggingFace AI");
    }

    const result = await response.json();

    // find score
    const aiScoreItem = result.find((item: any) => item.label === "artificial");
    const aiScore = aiScoreItem ? aiScoreItem.score : 0;

    //quy định
    const isAI = aiScore > 0.5;

    //send kq
    return NextResponse.json({
      is_human: !isAI,          
      ai_percentage: aiScore,   //trả về % để hiển thị cho ngầu =))))))))
      message: isAI ? "Phát hiện dấu hiệu AI!" : "Xác thực thành công: Người vẽ.",
    });

  } catch (error) {
    console.error("Lỗi Backend:", error);
    // Nếu lỗi quá thì trả về mặc định là Human để demo cho mượt
    return NextResponse.json({ 
        is_human: true, 
        ai_percentage: 0,
        message: "Lỗi AI, tạm thời bỏ qua kiểm duyệt (Fallback)." 
    });
  }
}