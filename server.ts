import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Help print status
console.log(`Gemini API Key defined: ${!!apiKey}`);

/**
 * 1. API: Generate Content Idea / Script from a keyword or event
 * Example keyword: "hôm nay có khách chốt bill 2 triệu sắm túi giày"
 */
app.post("/api/generate-idea", async (req, res) => {
  try {
    const { keyword, shopName, shopStyle, category } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: "Thừa thiếu từ khoá đầu vào!" });
    }

    const prompt = `
      Bạn là một chuyên gia sáng tạo nội dung TikTok và chủ chuỗi cửa hàng thời trang.
      Hãy viết kịch bản video TikTok cực kỳ cuốn hút, đánh trúng tâm lý Gen Z (18-25 tuổi) dựa trên thông tin sau:
      - Từ khóa/Sự kiện: "${keyword}"
      - Tên shop: "${shopName || "Cửa Hàng Thời Trang"}"
      - Phong cách chủ đạo: "${shopStyle || "Túi xách và giày dép Quảng Châu giá rẻ hot trend < 200k"}"
      - Ngành hàng: "${category || "Túi xách & Giày dép"}"

      Yêu cầu kịch bản:
      1. Đồ dùng thời trang túi xách/giày dép Quảng Châu phân khúc học sinh, sinh viên giá rẻ dưới 200k, cực kỳ hot trend, trendy, bắt trend nhanh.
      2. Sử dụng ngôn ngữ Gen Z thông dụng cá tính (ví dụ: "ét ô ét", "gét gô", "keo lỳ", "mãi mận", "vibe", "flex", "xu hướng", "heel", "outfit", "đỉnh chóp").
      3. Định dạng kịch bản phải sinh động theo từng cảnh quay (POV, hành động chân thực, cận cảnh túi xách/giày dép, âm thanh sôi động).
      4. Kịch bản bao gồm: Concept cụ thể, Tiêu đề giật gân, Hook giữ chân 3 giây đầu, kịch bản phân cảnh cụ thể hướng dẫn quay phim (Visual, Audio, Text Overlay trên màn hình), và lời khuyên chuẩn bị đạo cụ, nhạc nền.

      Hãy trả về dữ liệu dưới định dạng JSON có cấu trúc chính xác như sau:
      {
        "concept": "Tên concept video ngắn gọn (ví dụ: POV hài hước, Tình huống kịch tính, Review chân thật...)",
        "title": "Tiêu đề video cực kỳ cuốn hút để ghi caption hoặc đặt text bìa",
        "hook": "Câu hook 3 giây đầu tiên kích thích siêu tò mò",
        "targetAudience": "Phân tích tại sao Gen Z lại thích nội dung này",
        "scenes": [
          {
            "sceneNumber": 1,
            "visual": "Mô tả hình ảnh quay gì, góc máy thế nào chi tiết",
            "audio": "Mô tả âm thanh tiếng động bên ngoài hoặc câu nói lồng tiếng nói gì",
            "textOverlay": "Chữ chạy trên video hiển thị ra sao",
            "note": "Lưu ý hành động của diễn viên/nhân vật hoặc đạo cụ"
          }
        ],
        "voiceover": "Đoạn thuyết minh (lồng tiếng) liền mạch nếu có",
        "recommendations": "Lời khuyên chuẩn bị đạo cụ, âm nhạc (ví dụ nhạc capcut đang trend, nhạc remix giật giật...) để video dễ lên xu hướng"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    return res.json(result);
  } catch (error: any) {
    console.error("Error in /api/generate-idea:", error);
    return res.status(500).json({ error: error.message || "Có lỗi bất thường xảy ra" });
  }
});

/**
 * 2. API: Generate Daily Ideas
 * Automatically proposes 3-4 content options to prevent creative blockage for the shops.
 */
app.post("/api/generate-daily-ideas", async (req, res) => {
  try {
    const { storeName, storeStyle, storeCategory } = req.body;

    const prompt = `
      Hãy đề xuất 3 ý tưởng video ngắn (TikTok, Reels, Shorts) cực kỳ sáng tạo và ĐẮT KHÁCH hôm nay cho cửa hàng thời trang sau:
      - Tên cửa hàng: "${storeName || "Fashion Shop"}"
      - Phong cách đại diện: "${storeStyle || "Túi xách & giày dép Quảng Châu hottrend giá rẻ dưới 200k cho học sinh sinh viên Gen Z"}"
      - Ngành hàng chính: "${storeCategory || "Túi xách & Giày dép"}"

      Mỗi ý tưởng cần thiết thực, dễ quay chỉ với một nhân viên bán hàng hoặc mẫu đứng quay tại shop, bám sát các thể loại thịnh hành như:
      - POV dở khóc dở cười với khách hàng học sinh sinh viên.
      - Thử thách độ bền, kiểm chứng chất lượng túi/giày dưới 200k nhưng cực keo lỳ.
      - Phối đồ (Outfit check) biến hình siêu xịn chỉ sử dụng túi, giày của shop.
      - Khoe hàng mới về, khui seal túi xách Quảng Châu lấp lánh hottrend bám Douyin.
      - Drama ngắn tình huống nhân viên bán hàng dằn mặt trà xanh hoặc chiều khách hết cỡ.

      Hãy trả về dữ liệu dưới định dạng JSON chứa danh sách 3 ý tưởng:
      {
        "ideas": [
          {
            "id": "Số thứ tự 1-3",
            "title": "Tiêu đề ý tưởng giật gân, khơi gợi cảm hứng",
            "conceptType": "Thể loại sản xuất (POV / Review / Biến hình / Thử thách / Drama)",
            "shortDescription": "Tóm tắt ngắn 1-2 câu xem kịch bản này diễn ra như thế nào, làm nổi bật giá trị sản phẩm thời trang Quảng Châu giá rẻ",
            "estimatedDuration": "Thời lượng ước tính (ví dụ: 15s - 25s, 30s - 45s)",
            "difficulty": "Độ khó thực hiện (Dễ / Trung bình / Khó)",
            "promptSuggestion": "Một đoạn mô tả ngắn gọn dùng để người dùng có thể gửi yêu cầu viết chi tiết kịch bản này"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    return res.json(result);
  } catch (error: any) {
    console.error("Error in /api/generate-daily-ideas:", error);
    return res.status(500).json({ error: error.message || "Có lỗi bất thường xảy ra" });
  }
});

/**
 * 3. API: Analyze & Translate Chinese Video Script to Vietnamese GenZ style
 */
app.post("/api/analyze-chinese-video", async (req, res) => {
  try {
    const { rawChineseContent, shopName, storeStyle } = req.body;

    if (!rawChineseContent) {
      return res.status(400).json({ error: "Vui lòng nhập mô tả kịch bản hoặc text video Trung Quốc!" });
    }

    const prompt = `
      Bạn là một biên kịch TikTok chuyên Việt hóa nội dung Douyin Trung Quốc cực đỉnh cho shop thời trang Gen Z Việt Nam.
      Có một video xu hướng bên Trung Quốc có nội dung/mô tả như sau:
      "${rawChineseContent}"

      Hãy dịch và Việt hóa (localise) kịch bản này hoàn toàn:
      1. Thay thế tất cả các thuật ngữ, lối sống, tiếng lóng Trung Quốc bằng tiếng lóng, lối nói hài hước của Gen Z Việt Nam (độ tuổi 18-25).
      2. Gài gắm sâu sắc lợi thế cạnh tranh của shop: Túi xách & Giày dép Quảng Châu siêu bền đẹp, bắt trend cực nhanh, phân khúc học sinh sinh viên siêu rẻ dưới 200k.
      3. Biến đổi bối cảnh Trung Quốc thành bối cảnh thực tế tại shop (Ví dụ: bàn thu ngân, kệ túi xách trưng bày, gương thử giày, bãi giữ xe, v.v.).

      Hãy trả về dữ liệu dưới định dạng JSON có cấu trúc chính xác sau:
      {
        "originalSummary": "Tóm tắt ngắn kịch bản gốc Trung Quốc là gì",
        "localizedConcept": "Concept độc đáo sau khi đã Việt hóa cho shop thời trang",
        "culturalAdjustments": "Những điểm thay đổi sáng tạo từ bản Trung sang bản Việt (ví dụ thay đổi tiếng lóng, thay bối cảnh)",
        "vietnameseTitle": "Tiêu đề video tiếng Việt giật gân, cuốn hút",
        "scenes": [
          {
            "sceneNumber": 1,
            "visual": "Mô tả hình ảnh quay tại shop Việt chi tiết",
            "audio": "Mô tả giọng thoại lồng tiếng hoặc tiếng động hài hước bằng tiếng Việt",
            "textOverlay": "Text chạy trên màn hình cực trendy tiếng Việt",
            "note": "Đạo cụ cần dùng hoặc hành động cụ thể tại shop thời trang túi xách giày dép"
          }
        ],
        "suggestedCaption": "Caption gợi ý đăng tải thu hút kèm theo #hashtag xu hướng"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    return res.json(result);
  } catch (error: any) {
    console.error("Error in /api/analyze-chinese-video:", error);
    return res.status(500).json({ error: error.message || "Có lỗi bất thường xảy ra" });
  }
});

/**
 * 4. API: Optimize Hook & Review Draft Script
 */
app.post("/api/optimize-hook", async (req, res) => {
  try {
    const { draftScript, transformStyle, storeStyle } = req.body;

    if (!draftScript) {
      return res.status(400).json({ error: "Hãy nhập kịch bản nháp cần chỉnh sửa!" });
    }

    const prompt = `
      Bạn là chuyên gia tối ưu hóa thời gian giữ chân (viewer retention) 3 giây đầu trên TikTok.
      Có một kịch bản nháp của các bạn Media viết như sau:
      "${draftScript}"

      Hãy phân tích lý do kịch bản nháp này đang tẻ nhạt (ví dụ giới thiệu quá dài dòng, thiếu cú twist, thiếu hình ảnh kích thích thị giác khi lướt qua).
      Sau đó, hãy đề xuất sửa đổi và tối ưu theo phong cách "${transformStyle || "Hài hước, giật gân, thu hút"}".
      Sản phẩm trong kịch bản là túi xách hay giày dép thời trang Quảng Châu hottrend bắt mắt phân khúc học sinh giá rẻ dưới 200k.

      Hãy trả về JSON cấu trúc như sau:
      {
        "originalCritique": "Điểm tẻ nhạt của kịch bản nháp hiện tại (chỉ ra tại sao người xem sẽ vuốt qua trong 3 giây đầu)",
        "optimizedHooks": [
          {
            "type": "Tên thể loại hook (ví dụ: Độc lạ, Gây tò mò cực độ, Cảnh báo drama, Cam kết giá trị)",
            "hookText": "Dòng thoại cực chất lôi cuốn giữ ngay người lướt trong 3 giây đầu",
            "action": "Hành động/Hình ảnh giãy nảy, giật gân đi kèm câu thoại này"
          }
        ],
        "improvedTransitions": "Cách chuyển từ hook sang phần giới thiệu sản phẩm mượt mà không bị mang tiếng quảng cáo lộ liễu",
        "refinedScript": "Bản kịch bản rút gọn sau khi tối ưu bùng nổ, lược bỏ bớt các chi tiết rườm rà dài dòng"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    return res.json(result);
  } catch (error: any) {
    console.error("Error in /api/optimize-hook:", error);
    return res.status(500).json({ error: error.message || "Có lỗi bất thường xảy ra" });
  }
});

/**
 * 5. API: Create Captions tailored for different shops
 */
app.post("/api/generate-caption", async (req, res) => {
  try {
    const { videoConcept, storeStyle, storeProfile, quantity } = req.body;

    const prompt = `
      Hãy tạo một bộ caption cuốn hút chuẩn đăng TikTok, Reels, Instagram kèm theo các hashtag phù hợp dựa trên thông tin sau:
      - Concept video: "${videoConcept}"
      - Phong cách cửa hàng: "${storeStyle || "Túi xách & giày dép Quảng Châu hottrend dưới 200k cho Gen Z"}"
      - Điểm nhấn riêng biệt của thương hiệu này: "${storeProfile || "Phong cách năng động, bắt trend thần tốc cho học sinh sinh viên"}"

      Yêu cầu Caption:
      - Ngắn gọn, có icon dễ thương/hottrend phù hợp.
      - Có câu kêu gọi tương tác kích thích bình luận tăng thuật toán (ví dụ: tag đứa bạn thân vào xin vía, bình luận chiều cao chọn size).
      - Thẻ hashtag thông minh và thịnh hành (ví dụ: #tuixachulzzang, #giaygiare, #giamgiaphanluc, #outfit200k, #FashionGenz...)
      - Trả về ${quantity || 2} phương án khác nhau để người dùng lựa chọn.

      Hãy trả về dữ liệu dưới định dạng JSON như sau:
      {
        "options": [
          {
            "id": 1,
            "style": "Tên phong cách caption (ví dụ: Hài hước bựa, Cute lươn lẹo, Ngắn thả thính, Chốt đơn liền tay)",
            "caption": "Nội dung caption cụ thể cùng icon",
            "hashtags": [ "hashtag1", "hashtag2" ],
            "cta": "Câu kêu gọi hành động cụ thể"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    return res.json(result);
  } catch (error: any) {
    console.error("Error in /api/generate-caption:", error);
    return res.status(500).json({ error: error.message || "Có lỗi bất thường xảy ra" });
  }
});

/**
 * 6. API: Analyze TikTok Video Performance & Content Quality
 * Takes a TikTok link, analyze content vibe, estimate views/likes traffic, and propose key updates.
 */
app.post("/api/analyze-tiktok", async (req, res) => {
  try {
    const { tiktokUrl, concept, storeName, creator } = req.body;

    if (!tiktokUrl) {
      return res.status(400).json({ error: "Vui lòng nhập đường link TikTok bài đã đăng!" });
    }

    const prompt = `
      Bạn là Giám đốc Sáng tạo và Trưởng bộ phận Phân tích dữ liệu TikTok thời trang của hệ thống "Trucdoanpham Retail Fashion".
      Hãy phân tích, đánh giá chất lượng và ước tính hiệu suất truyền thông một cách cực kỳ sắc bén, thực tế cho video TikTok đã đăng sau:
      - Link TikTok: "${tiktokUrl}"
      - Concept video dự kiến: "${concept || "Chưa mô tả"}"
      - Shop thực hiện: "${storeName || "Túi xách & Giày dép sỉ Quảng Châu"}"
      - Bạn Media quay/dựng: "${creator || "Media Team"}"

      Mục tiêu của chúng ta là bán sỉ/lẻ Túi xách & Giày dép Quảng Châu giá mềm hottrend dưới 200k hướng đến GenZ (18-25 tuổi).
      Dựa trên link này, hãy "quét thử" bối cảnh thời trang, nhạc nền thịnh hành hiện tại và lập luận logic để trả về kết quả đánh giá chất lượng sản xuất và số liệu traffic thực tế (giả định dựa trên chất lượng kịch bản, sức hút của trend hiện đại, bối cảnh thực hiện).

      Hãy trả về dữ liệu dưới định dạng JSON có cấu trúc chính xác như sau:
      {
        "identifiedConcept": "Xác định concept thực tế của video (ví dụ: POV xéo sắc đầy duyên dáng, Review túi kẹp nách dìm hàng cực hài... )",
        "hookRating": "Đánh giá chất lượng của 3 giây đầu (Hook) (ví dụ: Xuất sắc, Trung bình, Quá dài dòng...)",
        "hookAnalysis": "Phân tích cụ thể dòng hook và hình ảnh giữ chân người xem tốt hay dở.",
        "visualRating": "Đánh giá bối cảnh quay, ánh sáng, góc máy tại kệ hàng (ví dụ: Đẹp mắt tôn sản phẩm, Có phần lộn xộn, Hơi thiếu sáng...)",
        "audioRating": "Đánh giá về tiếng lồng thoại, nhịp nhạc nền Capcut hot trend có ăn khớp không.",
        "weeklyPerformanceSummary": "Báo cáo tóm tắt hiệu suất tuần/tháng của bạn media ${creator} qua video này (Ví dụ: Đạt chỉ tiêu tốt, Đang bị đều đều thiếu đột phá, Cực cháy giữ chân lâu).",
        "metrics": {
          "views": 48500,
          "likes": 3200,
          "comments": 240,
          "shares": 180,
          "engagementRate": 7.1,
          "grade": "A"
        },
        "strengths": [
          "Điểm mạnh 1 (Ví dụ: Từ lóng Gen Z rất tự nhiên, biểu cảm bán hàng lanh lợi)",
          "Điểm mạnh 2 (Ví dụ: Quay cận cảnh đường may khoá túi xách dưới 150k siêu khôn)"
        ],
        "weaknesses": [
          "Điểm yếu 1 (Ví dụ: Nhạc hơi đè lên giọng thuyết minh ở phân cảnh 3)",
          "Điểm yếu 2 (Ví dụ: Cái kết kêu gọi mua hàng hơi bị cụt, thiếu nhịp kéo link bio)"
        ],
        "recommendations": [
          "Khắc phục 1 (Ví dụ: Lần sau chỉnh volume nhạc nền xuống còn 15% khi có thoại nhé)",
          "Khắc phục 2 (Ví dụ: Thêm hẳn sticker chỉ tay và nói trực tiếp 'link ở giỏ hàng em ghim góc trái nha' để tối ưu chuyển đổi)"
        ]
      }

      *Lưu ý về Metrics:* Hãy giả định các chỉ số views và likes thực tế một cách ngẫu nhiên nhưng cực kỳ logic dựa trên chất lượng và độ thu hút của link, dao động trong khoảng từ 3.000 đến 180.000 views, tỉ lệ likes tương xứng tầm 5% - 10% views. Điểm xếp hạng (Grade) từ D, C, B, B+, A, đến S (A+ hoặc S).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    return res.json(result);
  } catch (error: any) {
    console.error("Error in /api/analyze-tiktok:", error);
    return res.status(500).json({ error: error.message || "Có lỗi bất thường xảy ra" });
  }
});


// Serve static assets and handle routing for React (Vite middleware or SPA static)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Fallback to serve index.html for SPA routing in development
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const fs = await import("fs");
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Start Server on 0.0.0.0:3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://localhost:${PORT}`);
  });
}

startServer();
