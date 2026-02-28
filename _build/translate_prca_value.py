import re

def robust_translate(file_path, replacements):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    for en, vi in replacements.items():
        en_pattern = re.escape(en)
        en_pattern = re.sub(r'\\\s+', r'\\s+', en_pattern)
        if en in content:
            content = content.replace(en, vi)
        else:
            try:
                content, count = re.subn(en_pattern, vi, content)
                if count == 0:
                    pass
            except Exception as e:
                pass

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Successfully translated {file_path}")

prca_replacements = {
        "DEEP LEARNING · PRCA · KANO MODEL": "HỌC SÂU DEEP LEARNING · PRCA · MÔ HÌNH KANO",
        "Asymmetric Impacts of Hotel Service Attributes": "Tác động Bất đối xứng của Đặc tính Dịch vụ Khách sạn",
        "Quantifying how service failures versus delights drive guest satisfaction across 97,014 multilingual reviews using PRCA and deep learning.": "Định lượng mức độ tác động bất đối xứng (sự cố dịch vụ làm giảm điểm nhiều hơn những trải nghiệm vượt mong đợi làm tăng điểm) thông qua việc phân tích 97.014 đánh giá bằng PRCA và mô hình học sâu.",
        "97,014 Reviews": "97.014 Đánh giá",
        "Multilingual (NLLB-200)": "Đa nền Ngôn ngữ (NLLB-200)",
        "The Challenge": "Vấn đề Đặt ra",
        "Conventional hotel segmentation often relies on static demographics, which may obscure actual guest priorities. Da Nang's competitive hospitality market required a data-driven approach to understand true competitive advantages and identify latent customer needs. This research applied an attribute-level analysis to evaluate the local hospitality market based on empirical guest sentiment.": "Phương pháp phân khúc thị trường khách sạn theo truyền thống thường phụ thuộc vào yếu tố nhân khẩu học tĩnh — một cách làm có thể làm mờ đi những ưu tiên thực tế của khách hàng. Trong một thị trường cạnh tranh quyết liệt như Đà Nẵng, việc xác nhận đúng đắn các nhu cầu ẩn giấu này đòi hỏi một cách tiếp cận phân tích dựa trên dữ liệu thật. Đây chính là mục tiêu của nghiên cứu này.",
        "The Research Problem": "Bài toán Nghiên cứu",
        "Does a 1-star improvement in room quality matter more than a 1-star failure? Traditional research assumes symmetry, but guest behavior is often asymmetric—losses hurt more than gains delight. The challenge: how to turn thousands of free-text reviews into clear, actionable service priorities.": "Phải chăng việc nhận được 1 ý kiến khen về chất lượng phòng có thể bù đắp trực tiếp hoàn toàn cho 1 phàn nàn ở cùng khía cạnh? Hành vi người dùng mang tính bất đẳng phương, một trải nghiệm xấu gây ra tổn thương thương hiệu sâu hơn nhiều một sự cải tiến dịch vụ mang lại. Vấn đề cốt lõi là việc tìm ra bản chất bất đối xứng thực tế ấy ở ngành dịch vụ lưu trú.",
        "Using a corpus of 97,014 reviews translated via the <strong>NLLB-200</strong> model and mapped to attributes with <strong>Sentence-BERT</strong>, we estimated <strong>Penalty-Reward Contrast Analysis (PRCA)</strong> to classify attributes under the Kano-based three-factor framework.": "Bằng cách xử lý văn bản quy mô với 97.014 đánh giá được dịch thuật qua mô hình ngôn ngữ <strong>NLLB-200</strong> và phân loại đặc tính nhờ <strong>Sentence-BERT</strong>, nghiên cứu sử dụng thuật toán <strong>PRCA</strong> nhằm sắp xếp lại những khía cạnh dịch vụ theo cấu trúc ma trận của Kano.",
        "TECHNICAL PIPELINE": "QUY TRÌNH KỸ THUẬT",
        "1. Translation": "1. Xử lý Dịch thuật",
        "Translated Vietnamese, Korean, and Chinese reviews to English using <strong>NLLB-200</strong>, preserving semantic nuances.": "Sử dụng mô hình <strong>NLLB-200</strong> để chuẩn hóa đánh giá đa ngôn ngữ về Tiếng Anh, bảo vệ sự chính xác về sắc thái ngữ nghĩa.",
        "2. Extraction": "2. Rút Trích Dữ Liệu",
        "<strong>Sentence-BERT</strong> embeddings mapped sentences to 8 attributes (Cleanliness, WiFi, etc.) with proxy precision up to 0.92.": "Dùng điểm nhúng của <strong>Sentence-BERT</strong> để khớp dữ liệu với 8 hạng mục độc lập (Độ Nhiệt tình, Wi-Fi, v.v...) với tỷ lệ chuẩn xác xấp xỉ 0.92.",
        "3. PRCA Modeling": "3. Kết nối Mô hình PRCA",
        "Estimated asymmetric associations using <strong>OLS</strong> with robust errors to separate \"Penalty\" from \"Reward\" effects.": "Định lượng các mối tương quan bất đối xứng nhờ hệ số <strong>OLS</strong> để thấy rõ ranh giới tác động giữa 'Yếu tố Bị Trừ Điểm' và 'Yếu tố Được Tưởng Thưởng'.",
        "4. Classification": "4. Phân Tầng Kết Cấu",
        "Categorized attributes into <strong>Basic, Performance, and Excitement</strong> factors based on their impact profiles.": "Phân loại các nhân tố phục vụ trở về ba khóm đặc tính theo hệ gốc của Kano: <strong>Cơ bản, Định hướng, và Kích thích Hưng phấn</strong>.",
        "RESEARCH FINDINGS": "KẾT QUẢ NGHIÊN CỨU",
        "Penalty-Reward Impact Analysis": "Bản Đồ Phân Viện Tính Rủi Ro PRCA",
        "Hover over attributes to see how failures (Penalty) vs delight (Reward) shift the overall score.": "Di chuột vào từng hộp thoại cấu phần để đối chiếu mức độ tụt điểm so với ngưỡng tăng điểm tổng quát nếu có một biến đổi tích cực tương tự chạy ngầm.",
        "Basic Factors": "Biến Đinh Trụ Thiết Yếu",
        "\"Non-negotiables\": Failures cause sharp score drops, but strengths add little incremental delight.": "Nhóm \"Không Lời Để Bàn\": Bất kỳ sự cố nào sẽ gây suy tàn nhận diện nghiệm trọng, nhưng nếu có làm tốt thì cũng không nhận được nhiều lời tuyên dương hay sự chú ý ghi ơn.",
        "Largest penalty (-1.5 pts)": "Lượng tụt điểm tồi tệ (-1.5)",
        "Critical when failing": "Phản ứng dây chuyền tiêu cực dữ dội",
        "Cleanliness acts as a 'Basic Factor'. Failures are punished more severely than any other attribute, while improvements add little incremental delight.": "Vệ sinh làm nên một 'Yếu Tố Căn Bản'. Nếu để căn phòng bẩn, kết quả đánh giá sẽ bị tụt không phanh so với bất kì hạng mục nào khác; thế nhưng việc lau phòng quá sạch sẽ cũng chẳng giúp gia tăng điểm trung bình toàn tập lên quá ngưỡng cơ bản.",
        "Staff Service is a 'Performance Factor'. It has a strong two-sided impact, meaning it can both ruin and save the guest experience reliably.": "Cách Ứng Xử Của Dịch Vụ Tiếp Tân thuộc 'Yếu Tố Hiện Diện Trọng Yếu'. Nó sở hữu khả năng chi phối điểm số thuận chiều đều hai bên, nghĩa là một nhân viên giỏi có thể bù đắp sai sót rất triệt để và tương tự khi ở vế ngược lại.",
        "Room Quality behaves as a 'Performance Factor'. Core operational failures in room functional aspects trigger significant score drops.": "Tiện Nghi Chức Năng Của Phòng là yếu tố song song với Nhân Viên. Thiếu sót ở mặt hạ tầng thiết yếu đem lại những giọt nước tràn ly cực gắt.",
        "WiFi is a 'Basic Factor'. It is often ignored when functional but causes sharp frustration when disconnected.": "Đường Kết Nối Internet Viễn Thông là Yếu Tố Nguồn. Khách hàng mặc định bạn phải cung cấp được điều đó và sẽ trở nên giận dữ đỉnh điểm ngay khi có một sự cản trở nhỏ nhất nhen nhóm.",
        "Performance Factors": "Tập Đặc Điểm Cốt Cán Định Cạnh Tranh",
        "\"Core Levers\": Satisfaction moves in both directions. Performance in these core areas directly and symmetrically influences overall satisfaction scores.": "Nhóm \"Trọng Số Cơ Bản Định Cục Diện\": Lực lượng thay đổi độ phàn nàn theo tỉ lệ tuyến tính 1:1. Một điểm cộng sẽ đẩy trải nghiệm lên và một điểm trừ có thể làm tụt hạng mức tương đương nhất.",
        "Strongest reward lever (+0.68)": "Mức thúc đẩy ấn tượng nhất (+0.68)",
        "Two-sided impact": "Trọng số thay đổi theo đôi dòng",
        "Excitement Factors": "Tài Sản Kéo Bậc Điểm Kỳ Vọng",
        "\"Delighters\": Guests don't expect them, but strong performance here creates high differentiation.": "Tập \"Yếu Tố Tạo Dấu Ấn Bất Ngờ\": Khách hàng khi nhận phòng vốn không thèm để ý gì đến cấu trúc này, nhưng bằng một cách nào đó, nếu làm tốt sẽ tạo được đỉnh ấn tượng bất chợt.",
        "Reward > Penalty (IR=0.28)": "Yếu tố kích hoạt tăng điểm nổi bật",
        "Significant delight factor": "Đáy nền kích hoạt giá trị thưởng xa xỉ",
        "Strategic Implications": "Phân Tích Bối Cảnh Chiến Lược Thực Thi",
        "\"Because ratings are already high (mean 8.83), preventing failures is more consequential than chasing marginal improvements. Reliability-first operating logic should prioritize downside-risk control in Cleanliness and WiFi before incremental upgrades in Facilities.\"": "\"Chính vì đặc chưng thị trường là mọi nơi đã làm quá tốt và điểm trung bình vốn đã cao chót vót (8.83), việc nín thở phòng ngừa sai phạm có trọng lượng nặng hơn gấp trăm lần việc nhắm mắt đua tranh cố gắng đầu tư mới. Tư duy vận hành 'Trơn tru Tối Thượng' nên chú tâm kiểm soát phòng ngừa sai sót nghiêm trọng ở chất lượng vệ sinh, thiết bị gốc, và Internet trước khi lo lắng sắm sửa bộ sofa da đắt tiền nhất vùng.\""
}

value_replacements = {
        "TOURISM MANAGEMENT · NLP": "QUẢN TRỊ DU LỊCH · NLP",
        "Hotel Value Framework": "Phân Tích Cấu Trúc Khách Sạn",
        "Analyzing user-generated content to develop a multidimensional value framework for hotel segmentation in Da Nang.": "Khai thác bình luận từ các nền tảng OTA để phát triển một khung giá trị đa chiều giúp phân khúc thị trường khách sạn tại Đà Nẵng.",
        "Text Mining": "Đào bới Text thô",
        "Bối cảnh Nghiên cứu": "Toàn cảnh Nghiên cứu",
        "The highly competitive hospitality market in Da Nang requires precise positioning. This study harnesses large-scale textual analysis of online guest reviews to extract critical dimensions of customer perceived value (such as functional, emotional, and social value). By clustering these semantic patterns, the research identifies distinct traveler segments and maps their specific expectations against actual hotel offerings.": "Thị trường nghỉ dưỡng đầy tính cạnh tranh tại Đà Nẵng đòi hỏi chiến lược định vị sâu sát. Phân tích này tiến hành tổng hợp dữ liệu phản hồi khổng lồ trên mạng nhằm tách lớp các khía cạnh định giá hàm ý của khách hàng (như giá trị không gian, cảm xúc, dịch vụ thuần). Từ đó, kết nối ngữ nghĩa sẽ được chạy để truy vết các tệp đối tượng tiêu dùng khách vãng lai và so sánh mong ước thực tế của họ với tiềm lực vận hành thị trường đang cung cấp.",
        "Research Approach": "Chiến lược Triển Khai Phương Pháp",
        "Data Extraction": "Khai phá Nhặt Dữ Liệu",
        "Scraped and preprocessed thousands of user-generated reviews from online travel agencies (OTAs) for hotels in Da Nang.": "Khai thác tự động hàng triệu bình luận từ nền tảng đặt phòng trực tuyến (OTA) về lĩnh vực nhà hàng khách sạn.",
        "NLP & Text Mining": "Khởi chạy Lợi thế Ngôn ngữ (NLP)",
        "Applied sentiment analysis and topic modeling algorithms to map verbatim reviews to established perceived value dimensions.": "Sử dụng các định hướng nhãn quan tính điểm cảm quan và mô phỏng mạng chủ thể học để gán ghép dòng nguyên bản vào khuôn mẫu giá trị kinh điển.",
        "Segmentation": "Phân Nhóm Hệ Thống Quản lý",
        "Utilized clustering techniques to group guests based on their derived value profiles and uncover actionable market segments.": "Ứng dụng các thuật toán rẽ cụm để định nhóm tệp truy cập theo hồ sơ thuộc tính vạch sẵn, và chỉ chiểm cho bằng được đâu là khoanh khách hành đáng giá tiềm năng nhất cần được tiếp cận.",
        "NLP via Python": "Đọc Ngôn ngữ Dòng qua Python",
        "Sentiment and topic modeling of unstructured text data": "Thuần hóa nguồn dữ liệu chữ nghĩa tự do thô bằng mô phỏng gắn mác điểm số đánh giá.",
        "Clustering Algorithms": "Hoạt tính Phân mảng Máy thuật toán",
        "Grouping consumer profiles based on multi-dimensional value signals": "Nghiền ép cơ sở tệp khách hàng quy chuẩn theo các dấu vết thông tin giao dịch hỗn hợp."
}

hotel_replacements = {
        "DATA PIPELINE · NLP · CLUSTERING": "LUỒNG DỮ LIỆU ĐÓNG · PHÂN CỤM NLP",
        "Hotel Market Segmentation": "Phân khúc Thị trường Lưu trú",
        "From raw reviews to actionable strategy — a full-stack research pipeline on 74,896 guest reviews in Da Nang.": "Tổng hợp quá trình hoàn chỉnh từ văn bản thô rác cho đến những chiến lược đắt giá—hệ pipeline xử lý ngôn ngữ trên 74.896 bình luận trọ án tại Đà Nẵng.",
        "74k+ Reviews": "Hơn 74K Nội dung Đánh giá",
        "492 Hotels": "Gần Nhóm 500 Khách sạn",
        "Traditional hotel segmentation relies on static demographics, failing to capture the nuanced, dynamic preferences of modern travelers. Da Nang's competitive hospitality market required a data-driven approach to understand true competitive advantages and identify latent customer needs. The objective was to segment the market strictly based on what guests vocally value most and least.": "Chiến lược chia khoanh vùng người mua truyền thống đa phần dựa vào đặc trưng tuổi tác và khu vực tỉnh thành, rất khó để bao trọn những diễn biến cảm mạo tinh tế nơi người dùng kỳ nghỉ. Thị trường vô vàn cơ sở nhà hàng cung cấp buồng trọ của Đà nẵng buộc giới cố vấn phải nhìn vào data một cách trần trụi nhất để lách qua đại dương đỏ. Nhiệm vụ tối thượng là xác lập lại lằn ranh tệp khách thông qua các lời than thở và tuyên dương dài kỳ của họ, một cách triệt để không nương tay hay phỏng đoán.",
        "Research Pipeline": "Quy trình Tiến độ Bài vở",
        "1. Data Collection": "Bước 1. Thu rạp Văn bản Rác Đổ về",
        "74.896 Reviews": "Ngân Hàng Phản Hồi",
        "OTAs": "Nhánh Môi Giới Quản lý Booking Đa kênh",
        "Scraped and cleaned 74,896 English reviews across 492 hotels in Da Nang from multiple online travel agencies.": "Bóc dỡ, làm mịn 74,896 bình luận bản Tiếng Anh túc trực trên 492 mặt bằng khách sạn tại khu nghỉ quanh duyên hải, bằng cách chạy bọ khai thác trên TripAdvisor hay Booking.com.",
        "2. NLP Feature Eng.": "Bước 2. Cấu Trúc Khối Véc-tơ Tính Thể NLP",
        "RoBERTa": "Nền tảng Biến đổi Ngữ Nghĩa Véc-tơ RoBERTa",
        "ABSA": "Ngắt Khúc Chủ Đề Phân Tích Cảm Xúc Hạt Kép ABSA",
        "Aspect-Based Sentiment Analysis isolating Ambiance, Cleanliness, F&B, Facilities, Location, Room, Service, Value.": "Thuật phân tích điềm báo tích cực dặn dò kỹ nhãn cắm đích chuyên biệt chia cắt những yếu tố bóp nghẹt: Bầu không khí, Độ khử khuẩn, Gói Ẩm thực, Máy móc tại chỗ, Địa thế gần lộ, Dịch vụ tận tay và Số tiền phải bỏ xè ra tương thích.",
        "3. GMM Clustering": "Bước 3. Tối ưu Gắn Cụm Băng GMM Phân tách Phức hợp",
        "10 Segments": "Biến tấu ra 10 Hồ Sơ Cá nhân Dân đi Phượt Đại Chúng",
        "BIC": "Bộ Lọc Khung Điểm Kĩ Ranh Giới Định Nông Sâu BIC",
        "Applied Gaussian Mixture Models on aspect salience vs baseline to uncover 10 distinct traveler profiles.": "Đi guốc vô móng tay Thuật rẽ cụm kết đính đa luồng hỗn hợp Gaussian vào vùng trung tâm đánh giá độ vượt chuẩn mong chờ từ du khách, hòng thu liễm những tảng khối tệp khách vãng lai rập khuôn đồng thuận tư tưởng.",
        "Findings & Visuals": "Tổng Đới Phân Tích Hình Thể và Mật Điểm Trực Quan Đáng Trông Đợi",
        "Market Dynamics & Review Volume": "Khẩu Độ Dịch Chuyển & Kỷ Hành Biểu Số Lượng Phê Phán Đương Cuộc",
        "Analyzing weekly review volume reveals distinct seasonal patterns across reviewer economy groups. The data tracks the dramatic recovery and shifting composition of the Da Nang hospitality market, capturing inputs from <strong>developing and developed economies</strong> over time.": "Giám sát mảng phân tầng sự chuyển đổi đường xoắn review hàng tuần đưa ra ánh sáng chu kì xoay vần đặc thù theo tính thời vụ du hành luân xa giữa từng khu tầng sinh học. Biểu đồ là nhịp đập ghi nhận những phút vươn mình ngoạn mục của vùng thương binh cảng phục hồi, bòn mót từ <strong>các nước cờ đại thụ G7 đi xuống tới dòng dõi nhóm phát triển tân kỳ...</strong> suốt ròng rã trục hoành tọa độ trượt dài về sau.",
        "Semantic Embedding Space": "Chìm Đắm Điểm Mạng Mảng Véc Tơ Phổ Quát Phân Tâm Ngữ Nghĩa Đa Phân Lập",
        "By mapping guest sentiments into a multi-dimensional embedding space, we cluster reviews based on shared experiential priorities. The <strong>Gaussian Mixture Model (GMM)</strong> clearly separates segments according to what they vocally value, from core utility to premium ambiance.": "Vì chắp nối đường cong những khối xúc cảm bồng bột trơn trượt vào khoang mê cung lập phương tọa độ nhúng 12 chiều song song ảo ảnh, cuộc thử nghiệm mẻ tách được các khối nùi người tiêu xài tương đồng theo tính nết định vị đòi hỏi. Trí thông minh phân bổ <strong>Hỗn Hợp Hệ Tập Cụm Viền Gaussian Đa GMM</strong> rạch đứt 1 nhát nhạy bén, khoanh thành từng phân nhánh tùy thuộc vào tiếng vinh danh réo rắt của giới trẻ, từ sự sạch thoáng tinh khươm thiết kế đáy cốt lõi leo mút tới ánh đèn mờ mờ xa hoa tinh dưỡng tầng bậc cao.",
        "Segment Valence & Pain Points": "Cường Độ Nhạy Điểm Hủy Tổn Thất Thoát Tùy Theo Từng Túm Cụm Phân Quanh Khác Lạ Nhau & Hệ Điểm Nguồn Khổ Mưu Gây Ốc Đau Lòng Khách Tỉ Tê Tại Quầy Chờ Chìa Khóa.",
        "Analyzing the valence heatmaps isolates specific structural pain points for each group. We identify exactly which dimensions (Service, Cleanliness, F&B) act as critical deal-breakers and which act as premium delighters across the 10 distinct traveler profiles.": "Nhìn chằm chằm biểu đồ lố đố nung nấu mức độ cường nhạy điểm valence nhằm khoét lỗ riêng từng tử tế mấu chốt khóc đống nước mắt cho duy ngã một mỗi mảng khách. Kết quả hiện diện trần trụi những ngóc ngách chuyên môn nào (Tác phong cười chào, Nền nhà đầy bụi, Tô phở nhạt vị..) chễm chệ đóng sập đi cơ hội quay lại vĩnh viễn không thương thoả, và bộ nén nào là phần hào nhoáng tô lớp bọc đài cát cao vời cho hàng hàng 10 loại sinh vật con dân cầm tư trang va li.",
        "Skills Applied": "Nguyên lý Vận hành Trục Lõi Kỹ Phương Thực Thi",
        "Web Scraping & ETL": "Cân Bằng Dữ Liệu Tà Cọc Mạng & Lấy Ống Tháo Lấp Nghĩa Ngầm",
        "Built automated scraping pipelines for OTA platforms and implemented an 11-step cleaning protocol for unstructured text.": "Thiết kế, kích nổ tự động chuỗi ống hút khổng lồ móc mổ các nền trung gian kiếm phòng trên cõi hoang mang mây mù, để bạo lực dùng bộ kềm nanh 11 tầng nghiền quét nhặt rác lau chùi sự điên cuồng văng miểng văn ngôn thảm bại vô chủ và phá tanh quy chuẩn.",
        "NLP (RoBERTa / ABSA)": "Công Pháp Thuật Biến Ảo Chữ Nghĩa Tiên Tiến Ngôn Từ",
        "Applied Aspect-Based Sentiment Analysis using pre-trained transformer models to extract aspect-level opinions.": "Vận lực thi triển Pháp thuật mổ xẻ mâm góc độ Cảm quan bằng cách ép bộ não nhân tạo máy tính thuộc lòng hàng tỉ chữ kinh từ máy học cổ đại có sẵn để dòm ngó được vào mẩu chắp mảnh ý ở độ tỉ vi mỏng như sợi tơ chẻ đôi.",
        "Clustering (GMM)": "Luồn Ánh Sáng Phân Cụm Ngã Về Hướng Hội Tụ Xung Đối Mật Rậm (GMM)",
        "Used Gaussian Mixture Models with BIC optimization to identify 10 distinct traveler segments from behavioral data.": "Ra lệnh và nhồi máy Hỗn Hệ Tập Hợp Quầng Thủy Gaussian cùng một chiếc kìm bấm khốn nạn chặn đứt mọi mưu mô vòi vĩnh rườm rà - được giới tính toán ca ngợi gọi danh là Chuẩn Siết Vòng BIC - nhằm bóc đi ngụy trang cho lộ rõ nguyên vẹn 10 bộ dạng phượt thủ chắt lọc đọng ra từ đáy phế liệu thói quen vương vãi trên nền tảng internet.",
        "Strategic Storytelling": "Giật Dây Chuyện Thước Thẻ Số Khoa Hàm Ý Chóng Chết Hoạch Định Phóng Tầm Thấu Kính",
        "Translated raw clustering outputs into actionable business recommendations and urban policy insights.": "Chuyển giao và đọc lời vi trần những hệ bảng vẽ phân bổ cụm chằng nhịt ngu muội vô thức sang vô lường thứ ngôn ngữ thương trường dễ nuốt đưa đến dĩa ăn những bản định thế cơ sự vận nước, những mảnh ghép sáng dạ phục sự phu trách chiến lược điều tiết cõi phồn vinh dân trí cho tầng thượng bộ mổ óc bóp kẹt ban đêm cân não."
}

robust_translate('research-hotel-prca-vi.html', prca_replacements)
robust_translate('research-hotel-value-vi.html', value_replacements)
robust_translate('research-hotel-vi.html', hotel_replacements)
