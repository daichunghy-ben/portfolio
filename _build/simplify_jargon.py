import re, glob

def patch(file_path, replacements):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    changed = 0
    for old, new in replacements.items():
        if old in content:
            content = content.replace(old, new)
            changed += 1
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  {file_path}: {changed} fixes")

# ===== PROJECTS-VI.HTML =====
print("=== projects-vi.html ===")
patch('projects-vi.html', {
    # Simplify card skill tags that are still jargon
    "Dịch thuật Đa ngôn ngữ (NLLB-200)": "Dịch Đa ngôn ngữ (NLLB-200)",
    "Véc-tơ Ngữ nghĩa (Sentence-BERT)": "Phân loại Ngữ nghĩa (BERT)",
    "Phân tích Đối lập Phạt-Thưởng (PRCA)": "Phân tích Mức Hài lòng (PRCA)",
    "Khảo sát Định lượng Mảng rộng": "Khảo sát Định lượng",
    "Mô hình Hóa Khảo sát Số": "Phân tích Thống kê",
    "Hành vi Sở hữu Tâm lý Cục bộ": "Tâm lý Sở hữu nơi Công sở",
    "Định lượng Khảo sát Nhanh": "Thiết kế Khảo sát",
    "Phân Tích Đề án Cấm Xe máy Sâu": "Chính sách Cấm Xe máy",
    "Lưới Cấu trúc Giá trị": "Khung Giá trị",
    "Mô hình Đo Kinh tế Lượng": "Kinh tế Lượng",
    "Tâm lý học Thực đơn Buffet Khách sạn": "Cú Hích Menu Buffet",
    "Thiết lập Môi trường Giả lập": "Thiết kế Thực nghiệm",
    "Hồi quy Đường thẳng Vô hướng": "Hồi quy Tuyến tính",
    "Chất lượng Dinh dưỡng Cấp Đại học": "Dinh dưỡng & Chế độ ăn Sinh viên",
    "KOL Ảo & Niềm tin Tiêu dùng GenZ": "KOL Ảo & Niềm tin Gen Z",
    "Hành vi Sở hữu Tâm lý Cục bộ Acceptance": "Tâm lý Sở hữu nơi Công sở",
})

# ===== INDEX-VI.HTML =====
print("=== index-vi.html ===")
patch('index-vi.html', {
    "Phân lách MECE trực quan": "Phân tích MECE có cấu trúc",
    "Đánh mô hình chuẩn (ANOVA, SEM)": "Kiểm định Thống kê (ANOVA, SEM)",
    "Kỹ năng Làm việc Mềm mại": "Kỹ năng Mềm",
    "Giải pháp Lãnh đạo Đa khối lượng": "Quản lý & Dẫn dắt Đội nhóm",
    "Điều hòa và Khắc phục sự cố": "Giải quyết Xung đột & Sự cố",
    "Thao tác Quản trị hệ thống Vận hành": "Quản trị Vận hành",
    "Diễn dịch NLP (RoBERTa, NLTK)": "Phân tích Ngôn ngữ (NLP)",
    "Cấu trúc SQL / Biến đổi ETL": "SQL / Xử lý Dữ liệu (ETL)",
    "Kiểm soát Version / Git": "Quản lý Mã nguồn (Git)",
    "PowerBI / Tableau / Excel Mở rộng": "Power BI / Tableau / Excel",
    "Quy chiếu Chỉ số Đối thủ": "Phân tích Đối thủ Cạnh tranh",
    "Đo lường Hành vi Tập khách hàng": "Phân tích Hành vi Người dùng",
    "Executive Data\n                                Storytelling": "Trình bày Dữ liệu\n                                cho Lãnh đạo",
    "Survey & Cấu trúc Form Thực nghiệm": "Thiết kế Khảo sát & Thực nghiệm",
    "Cấu trúc Form Thực nghiệm\n                        </h4>": "Thiết kế Thực nghiệm\n                        </h4>",
})

# ===== RESEARCH-EV-VI.HTML =====
print("=== research-ev-vi.html ===")
patch('research-ev-vi.html', {
    # Badge was translated but can be simpler
    "THỬ NGHIỆM\n                        LỰA CHỌN RỜI RẠC · MỨC SẴN LÒNG CHI TRẢ (WTP)": "KHẢO SÁT\n                        LỰA CHỌN CHÍNH SÁCH · PHÂN TÍCH MỨC CHI TRẢ",
    "Thử nghiệm Lựa chọn Quy mô Rộng": "Khảo sát Quy mô Lớn",
    "Công cụ\n                        Phân tích & Kỹ năng Ứng dụng": "Phương pháp\n                        & Kỹ năng Phân tích",
    "Xây dựng các bộ lựa chọn cân bằng trên hệ mô phỏng D-Optimal nhằm tiến hành một cuộc đánh giá thực thi đánh đổi sát sao.": "Thiết kế các bộ câu hỏi khảo sát cân bằng giúp người trả lời cân nhắc được sự đánh đổi giữa các phương án một cách thực tế.",
    "Áp dụng các mô hình hệ thống đo lường ngẫu nhiên để ước lượng các đặc trưng tiên quyết và Mức sẵn lòng chi trả.": "Sử dụng các mô hình thống kê để đo lường mức ưu tiên và số tiền người dân sẵn sàng bỏ ra cho từng phương án.",
    "Dự kiến cách khía cạnh vật lý và thẩm mỹ tác động đến mức độ chi trả thêm của tiêu dùng nội địa Hàn Quốc.": "Đánh giá cách kiểu dáng và màu sắc xe ảnh hưởng đến mức giá mà người tiêu dùng sẵn sàng trả thêm.",
    "Mô phỏng kịch bản tiếp thị để chắt lọc khối tính năng cân bằng với giá cả xuất xưởng.": "Xây dựng các kịch bản giả định để tìm ra tổ hợp tính năng và giá cả tối ưu.",
    "Mô phỏng Thị trường Bán lẻ": "Dự báo Thị trường",
    "Số hóa Đồ thị": "Trực quan hóa Dữ liệu",
    "Ví dụ về những hồ sơ trắc nghiệm được trình diện cho đáp viên trước khi họ thực hiện bước trả lời.": "Ví dụ về các phương án chính sách được đưa ra cho người tham gia khảo sát lựa chọn.",
    "Trợ giá mua Xe Máy điện": "Hỗ trợ mua Xe máy Điện",
    "Ngân sách Hỗ trợ": "Hỗ trợ Tài chính",
    "Nới rộng Không gian Xanh": "Mở rộng Không gian Xanh",
    "Tái Quy hoạch Đô thị": "Quy hoạch Đô thị",
    "Tái đầu tư Hệ thống & Minh bạch": "Tái đầu tư & Giám sát Công khai",
    "Phân bổ Cục diện Quỹ": "Phân bổ Ngân sách",
    "Giảm Giá vé Vận tải BRT": "Giảm giá Vé Xe buýt",
    "Mở Rộng Đường Nội thành": "Mở rộng Mạng lưới Giao thông",
    "Phương tiện Giao thông Mạng": "Giao thông Công cộng",
    "(Phụ chi Cố định)": "(Chi phí)",
    "Ra lệnh Thu hồi Xe gắn máy": "Cấm Tất cả Xe máy",
    "Biện pháp Siết chặt Quy định": "Biện pháp Hạn chế (Cấm)",
    "Thu hồi Toàn bộ Vận tải Tư nhân": "Cấm Tất cả Phương tiện Cá nhân",
    "Siết chặt Tuyệt đối": "Hạn chế Toàn diện",
    "Các điều luật cấm đoán đơn lẻ phải đi kèm cùng những gói hỗ trợ bù đắp hệ thống, điển hình nhất là khoản tiền đền bù thu mua để hỗ trợ dân sinh chuyển đổi qua hệ xe máy điện năng và cải cách diện rộng mạng lưới xe buýt BRT.": "Các lệnh cấm đơn lẻ sẽ bị phản đối mạnh. Muốn được người dân chấp nhận, chính sách cần đi kèm hỗ trợ tài chính (như trợ giá xe máy điện) và mở rộng hệ thống xe buýt công cộng.",
    "Được cố vấn bởi <strong>Dr. Kacy Hồ</strong> · Ra mắt tại Kỷ yếu <strong>CIEMB 2024</strong> · Đồng Trợ lý tác giả": "Hướng dẫn bởi <strong>Dr. Kacy</strong> · Công bố tại <strong>Hội nghị CIEMB 2024</strong> · Đồng tác giả",
    "Thẩm định Chức năng": "Phân tích Thiết kế Sản phẩm",
})

# ===== RESEARCH-HOTEL-PRCA-VI.HTML =====
print("=== research-hotel-prca-vi.html ===")
patch('research-hotel-prca-vi.html', {
    "HỌC SÂU DEEP LEARNING · PRCA · MÔ HÌNH KANO": "HỌC SÂU · PHÂN TÍCH HÀI LÒNG · MÔ HÌNH KANO",
    "Phải chăng việc nhận được 1 ý kiến khen về chất lượng phòng có thể bù đắp trực tiếp hoàn toàn cho 1 phàn nàn ở cùng khía cạnh? Hành vi người dùng mang tính bất đẳng phương, một trải nghiệm xấu gây ra tổn thương thương hiệu sâu hơn nhiều một sự cải tiến dịch vụ mang lại. Vấn đề cốt lõi là việc tìm ra bản chất bất đối xứng thực tế ấy ở ngành dịch vụ lưu trú.": "Liệu một lời khen có thể bù lại một lời phàn nàn? Thực tế cho thấy không hoàn toàn — một trải nghiệm tệ gây thiệt hại cho thương hiệu nhiều hơn so với lợi ích từ một cải tiến tương đương. Nghiên cứu này tập trung tìm ra mức độ chênh lệch thực sự đó trong ngành khách sạn.",
    "bất đối xứng (sự cố dịch vụ làm giảm điểm nhiều hơn những trải nghiệm vượt mong đợi làm tăng điểm)": "bất đối xứng (lỗi dịch vụ làm giảm điểm nhiều hơn so với mức tăng từ trải nghiệm tốt)",
})

# ===== RESEARCH-MOTORBIKE-BAN-VI.HTML =====
print("=== research-motorbike-ban-vi.html ===")
patch('research-motorbike-ban-vi.html', {
    "Hồi quy Multinomial Logit": "Mô hình Logit Đa lựa chọn",
    "Hồi quy Mô hình Multinomial Logit Chuyên biệt (MNL)": "Mô hình Logit Đa lựa chọn (MNL)",
    "Hồi quy Mô hình Multinomial Logit Chuyên biệt": "Mô hình Logit Đa lựa chọn",
    "Sử dụng Thuyết Hữu Dụng Ngẫu Nhiên và mô hình Multinomial Logit nhằm ước lượng các mức độ khác biệt về sở thích trên các tập nhân khẩu học.": "Sử dụng mô hình thống kê để đo lường sự khác biệt về sở thích giữa các nhóm dân cư khác nhau.",
    "Trích xuất sở thích thông qua các kỹ thuật đánh giá đa biến số.": "Khảo sát ý kiến người dân về các phương án chính sách khác nhau.",
    "Dự báo xác suất ra quyết định và ước tính các khung thông số cho những đặc thù sở thích đa dạng.": "Dự đoán xác suất lựa chọn của người dân và phân tích sự khác biệt giữa các nhóm.",
    "Triển khai khảo sát diện rộng dựa trên phương pháp bộc lộ sở thích (stated preference), nơi người trả lời cân nhắc sự đánh đổi giữa các điểm ưu tiên khác nhau.": "Triển khai khảo sát quy mô lớn, trong đó người tham gia đánh giá và lựa chọn giữa các gói chính sách khác nhau.",
    "Xây dựng các bộ hồ sơ chính sách giả định đan xen giữa mức độ hạn chế lưu thông, ngân sách trợ giá và sự mở rộng của phương tiện công cộng.": "Xây dựng các kịch bản chính sách kết hợp giữa mức độ hạn chế, mức trợ giá, và mức đầu tư cho giao thông công cộng.",
    "Thiết lập Kịch bản Chính sách": "Thiết kế Kịch bản",
    "Xây dựng Mô hình Kinh tế Lượng": "Mô hình Phân tích",
    "Diễn giả tại <strong>Hội nghị CIEMB 2025</strong>": "Báo cáo tại <strong>Hội nghị CIEMB 2025</strong>",
})

# ===== RESEARCH-NUTRITION-VI.HTML =====
print("=== research-nutrition-vi.html ===")
patch('research-nutrition-vi.html', {
    "Bảng hỏi Kiến thức Dinh dưỡng Tham chiếu và Bảng hỏi Hoạt động Thể chất Thường niên Quốc tế (IPQA)": "Bảng hỏi Kiến thức Dinh dưỡng và Bảng hỏi Hoạt động Thể chất Quốc tế (IPAQ)",
    "Ứng dụng tiên phong Bảng tính Chất lượng Dinh dưỡng Điển hình (DQQ) tại Việt Nam nhằm đo đạc mức độ đa dạng của các nhóm thực phẩm và lượng calo tiêu thụ.": "Lần đầu áp dụng Bảng đánh giá Chất lượng Bữa ăn (DQQ) tại Việt Nam để đo mức độ đa dạng thực phẩm và thói quen ăn uống.",
    "Thực hiện đa phân tích hồi quy tuyến tính để vạch rõ sơ đồ các mối quan hệ đa bên trong khi vẫn kiểm soát chặt chẽ các biến số như tuổi, giới tính và chỉ số BMI.": "Sử dụng hồi quy tuyến tính để phân tích mối liên hệ giữa các yếu tố, đồng thời kiểm soát các yếu tố nền như tuổi, giới tính và BMI.",
    "Vận hành Khảo sát Định lượng": "Triển khai Khảo sát",
    "Ban hành và tổ chức hệ thống tham chiếu đo lường chuyên biệt cho y tế cộng đồng.": "Triển khai bảng câu hỏi đã được kiểm chứng để thu thập dữ liệu sức khỏe.",
    "Mạch Hồi quy Đa biến Tuyến tính": "Phân tích Hồi quy",
    "Dựng mô hình thông số cho các biến liên tục tác động lên hệ chấm điểm chất lượng calo.": "Phân tích các yếu tố ảnh hưởng đến điểm chất lượng dinh dưỡng.",
    "Khung Khảo sát Chuẩn": "Bộ Công cụ Khảo sát",
    "Thống kê & Xử lý Số liệu": "Phân tích Thống kê",
})

# ===== RESEARCH-ARTS-WORKSHOP-VI.HTML =====
print("=== research-arts-workshop-vi.html ===")
patch('research-arts-workshop-vi.html', {
    "Đề xuất một bộ khung giá trị nhiều lớp hợp nhất giữa hệ tư tưởng hưởng lạc cá nhân, tính hữu dụng thực sống, và cả các cấu trúc tương trợ tạo lập tập thể.": "Xây dựng khung phân tích kết hợp giữa giá trị giải trí cá nhân, tính thiết thực, và yếu tố xã hội.",
    "Phân phối các bảng câu hỏi đóng đến lượng lớn người dùng vừa mới tham gia nhiều kiểu cấu trúc workshop khác nhau nhằm ghi nhận chất lượng dịch vụ và xác suất họ quay lại vào tuần tới.": "Thu thập phản hồi từ nhiều người tham gia các loại workshop khác nhau để đánh giá chất lượng trải nghiệm và ý định quay lại.",
    "Khởi động kịch bản Mô hình phương trình cấu trúc (SEM) để rà xuất mạch nguyên nhân nhân quả nối ngang dọc những điểm chiều kích giá trị và hệ lụy của hành vi dứt khoát.": "Sử dụng mô hình SEM để kiểm tra mối quan hệ nhân quả giữa các yếu tố giá trị và hành vi của người tham gia.",
    "Thiết kế Bản Đồ Cấu Hình Giá Trị": "Xây dựng Khung Giá trị",
    "Mở rộng và quy chuẩn hóa các đặc tính cấu thành nên hành vi của một khách hàng điển hình.": "Phát triển thang đo và xác nhận các yếu tố ảnh hưởng đến hành vi khách hàng.",
    "Hệ Phương Trình SEM": "Phân tích SEM",
    "Áp dụng kỹ thuật xử lý SEM để xác lập mối quan hệ phụ thuộc giữa các biến độc lập.": "Kiểm định mối quan hệ nhân quả giữa các yếu tố bằng mô hình phương trình cấu trúc.",
    "Cấu trúc Định hướng Phương pháp": "Phương pháp Nghiên cứu",
    "Ban hành Chuỗi Khảo sát": "Triển khai Khảo sát",
    "Mô Hình Cấu Trúc Tuyến (SEM)": "Phân tích Nhân quả (SEM)",
})

# ===== RESEARCH-BUFFET-VI.HTML =====
print("=== research-buffet-vi.html ===")
patch('research-buffet-vi.html', {
    "Cú Hích trên Menu Buffet": "Thiết kế Menu Thông minh",
    "Thử nghiệm chiến thuật sắp xếp 'Ưu tiên Phủ sóng Món Ăn Tốt Cho Sức Khỏe Lên Đầu' (HOF) nhằm điều hướng giảm lượng calo nạp vào cơ thể trong môi trường tiệc đứng.": "Thử nghiệm liệu việc đặt các món ăn lành mạnh lên đầu menu buffet có giúp giảm lượng calo mà thực khách chọn.",
    "Cấu Trúc Thực Nghiệm": "Thiết kế Thực nghiệm",
    "Lý thuyết Cú hích hành vi (Nudge) quy tắc rằng sự sắp xếp trong việc giới thiệu các lựa chọn có tác động cốt lõi đến quyết định. Nghiên cứu này thử nghiệm giả định: liệu việc đẩy các món ăn lành mạnh lên trước tiên tại một quầy lấy đồ ăn buffet có thể can thiệp giảm mức tiêu thụ calo hay không — mà không hề dùng luật định thắt chặt giới hạn hay đánh tráo các khay đồ ăn trên bàn tiệc.": "Theo lý thuyết Cú hích (Nudge), thứ tự trình bày lựa chọn có thể ảnh hưởng đáng kể đến quyết định. Nghiên cứu này kiểm tra: liệu việc sắp xếp các món lành mạnh lên đầu menu buffet có giúp giảm lượng calo mà thực khách chọn — mà không cần cấm hay thay đổi bất kỳ món ăn nào.",
    "Tạo ra môi trường thực nghiệm đối chiếu liên tục nhóm giả dược (sắp xếp tùy biến) và nhóm chịu can thiệp (theo chuẩn chuỗi HOF).": "Thiết kế thí nghiệm so sánh giữa nhóm đối chứng (menu bình thường) và nhóm thử nghiệm (menu đặt món lành mạnh lên đầu).",
    "Thu Thập Số Liệu Ứng": "Thu thập Dữ liệu",
    "Chép báo cáo thực đơn từ người đứng quầy và định dạng nhu cầu hấp thụ của đối tượng theo các điều kiện được nới lỏng tùy nghi.": "Ghi nhận món ăn được chọn và lượng calo dự kiến từ mỗi người tham gia thí nghiệm.",
    "Chẩn Đoán Kiểm Định ANOVA": "Kiểm định ANOVA",
    "Phân đoạn kỹ thuật đo lường sai số biến thiên nhằm so sánh mức lượng calo tiêu thụ trung bình giữa các cụm và ước chừng mốc ngưỡng khả báo (significance).": "So sánh lượng calo trung bình giữa các nhóm để xác định liệu sự khác biệt có ý nghĩa thống kê hay không.",
    "Cấu trúc Định hướng Phương pháp": "Phương pháp Nghiên cứu",
    "Phương pháp thiết kế giữa các chủ thể cùng với việc thay đổi ngẫu nhiên tham số.": "So sánh giữa nhóm đối chứng và nhóm thử nghiệm được phân chia ngẫu nhiên.",
    "Lệnh Lọc ANOVA & Giả thuyết Hệ": "Kiểm định ANOVA & Giả thuyết",
    "Phép đo lường toán học điểm phân giữa của đám đông và suy rộng ra diện ảnh hưởng bao chót.": "So sánh giá trị trung bình giữa các nhóm và đánh giá mức độ ảnh hưởng.",
})

# ===== RESEARCH-PSYCH-OWNERSHIP-VI.HTML =====
print("=== research-psych-ownership-vi.html ===")
patch('research-psych-ownership-vi.html', {
    "Quyền Sở Hữu Tâm Lý Công Sở": "Tâm lý Sở hữu nơi Công sở",
    "Hỗ Trợ Phát Triển Học Thuật (UEH)": "Nghiên cứu tại ĐH Kinh tế (UEH)",
    "Dự án này đánh giá mối liên kết giữa việc làm chủ tinh thần — nôm na là cảm giác \"tài sản/công việc này là máu xương của chính tôi\" — và sự gắn bó khắng khít của nhân sự nội bộ. Dựa trên phân tích cả hình thể sở hữu riêng tư và tính chia sẻ nhóm, mục tiêu của dự án là giúp các công ty nhận ra cách nuôi trồng sợi dây cảm xúc sâu sắc giữa người làm công ăn lương và khuông viên văn phòng. Công tác này được giám định dưới vai trò cố vấn chuyên môn của các Giảng viên trường Đại học Kinh Tế (UEH).": "Nghiên cứu tìm hiểu mối quan hệ giữa cảm giác \"đây là công việc của mình\" và mức độ gắn bó của nhân viên. Bằng cách phân tích cả tâm lý sở hữu cá nhân lẫn tập thể, dự án hướng tới giúp doanh nghiệp xây dựng sự gắn kết sâu sắc hơn giữa nhân viên và tổ chức. Được thực hiện dưới sự hướng dẫn của giảng viên ĐH Kinh tế TP.HCM (UEH).",
    "Cấu trúc Định hướng Phương pháp": "Phương pháp Nghiên cứu",
    "Ghi chép Hệ Phỏng vấn Mỏng (IDI)": "Phỏng vấn Chuyên sâu (IDI)",
    "Tiến hành đối thoại sâu một chạm ròng rã nhằm xây đắp bộ khung hoạt động cho hệ hành vi vi sinh sự việc và tìm vạch nguồn cơn chôn giấu phía sau sự hình thành niềm tin làm chủ doanh nghiệp ấy.": "Thực hiện phỏng vấn sâu để tìm hiểu các yếu tố hình thành cảm giác sở hữu trong công việc.",
    "Định Hình Biên Khảo Sát Tự Biến Đo": "Thiết kế Bảng khảo sát",
    "Sáng chế nên chốt thang đo hệ vạn năng đạt độ hoàn thiện cao, nhắm thẳng chuyên trị vào việc tính lường mức độ sở hữu vi thể, sở hữu luân hồi mạng tập thể, và sự cam kết dốc lòng tại bàn làm việc.": "Xây dựng thang đo đo lường mức độ sở hữu cá nhân, sở hữu tập thể, và cam kết tình cảm với tổ chức.",
    "Phân Tích Cấu Tạo Phân Số Định Lượng": "Phân tích Định lượng",
    "Tung tổ hợp hàm cấu trúc phương trình giả lập không gian (SEM) và chuỗi mắt xích đứng ở giữa môi giới để chứng thực những dòng đường giới hạn phụ thuộc kết nối tương quan giữa nhân nguyên với hệ quả trồi sụt.": "Sử dụng mô hình SEM và phân tích trung gian để kiểm tra mối quan hệ giữa các yếu tố.",
    "Giao Diện Dò Vét Phỏng Vấn Kèm Câu Hỏi (IDI)": "Phỏng vấn Chuyên sâu (IDI)",
    "Hệ phỏng vấn rà quét nội tâm nhằm lót nền xây kết cấu sơ bộ đối với người lao động thuần thói quen nội sinh.": "Phỏng vấn sâu để xây dựng khung phân tích hành vi nhân viên.",
    "Công Quỹ Định Mức Điểm Rơi Phức Hợp (SEM & Trung gian Xét Phân)": "Phân tích SEM & Trung gian",
    "Nghệ thuật xảo quyệt dùng để vẽ mạch phương trình chu tuyến tính đứng chung một trục và thẩm tra đặc tuyến giới tuyến bị cô lập qua khâu gián đoạn.": "Mô hình phương trình cấu trúc và phân tích trung gian để kiểm định giả thuyết.",
})

# ===== RESEARCH-VIRTUAL-INFLUENCERS-VI.HTML =====
print("=== research-virtual-influencers-vi.html ===")
patch('research-virtual-influencers-vi.html', {
    "KỲ HỘI NGHỊ EEEU THƯỜNG NIÊN · ĐỊNH LƯỢNG": "HỘI NGHỊ EEEU · NGHIÊN CỨU ĐỊNH LƯỢNG",
    "Sự Xuất Hiện KOL Ai Ảo & Lòng Tin Giới Trẻ": "KOL Ảo & Niềm tin Gen Z",
    "Phân tích quy trình thiết lập nền móng niềm tin giữa khách hàng Thế hệ Gen Z trẻ trung và thế giới những nhân vật Tiếng Nói Ảnh Hưởng (KOL) được xây dựng hoàn toàn từ Trí tuệ Nhân tạo AI đắp nặn nên.": "Phân tích cách Gen Z xây dựng niềm tin với các KOL ảo được tạo bởi AI và tác động đến ý định mua hàng.",
    "Cộng sự Tác Phẩm Hệ Tri Thức Vi Mô": "Đồng tác giả",
    "Khi các Tiktoker hay KOL nhân tạo cội nguồn cõi mây đang sinh sôi nảy nở trên hệ sinh thái xã hội siêu kết nối 5G, thấu hiểu cách thức Gen Z theo dõi và đặt để lòng trung thành với họ là vấn đề cốt nhục chiến lược đối với các tập đoàn định hình hình ảnh công khải. Hồ sơ này phân tích mạch liên đới cảm xúc tâm lý nhằm bóc tách công thức những kẻ gây tiếng vang không thuộc thế giới vật lý này cài gắm sức lôi cuốn giả tưởng và tương tác quy chụp liên lụy (parasocial) với tập người hâm mộ mỏng dạ non kíp tuổi đời.": "Khi các KOL ảo ngày càng phổ biến trên mạng xã hội, việc hiểu cách Gen Z đánh giá và tin tưởng họ là câu hỏi quan trọng cho các thương hiệu. Nghiên cứu này phân tích các yếu tố tâm lý giúp KOL ảo tạo dựng độ tin cậy và mối quan hệ gần gũi với người theo dõi trẻ.",
    "Cấu trúc Định hướng Phương pháp": "Phương pháp Nghiên cứu",
    "Khởi Màn Phục Sinh Tài Liệu Nền Điển Mạo Nạn": "Tổng quan Tài liệu",
    "Liên đới tóm tắt kho tàng mạng cấu trúc sẵn có chuyên xẻ góc về hiện tượng giao tiếp tình cảm đơn phương vô thức, tầm với của sự đáng tin từ đầu mối nguồn tin, và quá trình hoài thai niềm khao khát cậy nhờ qua dòng giao tiếp số rỗng ruột.": "Tổng hợp các nghiên cứu trước về tương tác giả xã hội (parasocial), độ tin cậy nguồn tin, và cách hình thành niềm tin trên nền tảng số.",
    "Chế Tài Ràng Định Mẫu Số Đa Lô": "Khảo sát Định lượng",
    "Vẽ rạch và phân tuyến đợt khảo sát trắc nghiệm bắn thẳng vào tệp tiêu chí người lướt ứng dụng mạng tuổi Gen Z hòng trục vớt những mẫu chuyện trắc ẩn mang ý niệm bồi thắp sự tín nhiệm.": "Thiết kế và triển khai khảo sát nhắm vào người dùng Gen Z trên mạng xã hội để đo lường các yếu tố ảnh hưởng đến niềm tin.",
    "Mô Phỏng Trục Toán Cắt Cụm Băng Bảng": "Phân tích Thống kê",
    "Gây cấn cho đường quy tuyến mô phỏng hồi lực và màng trung hạn nhằm châm biếm soi đo các giả định tuyên bố về bộ móng phát nguồn từ điểm mút tin tưởng nối gót kéo chốt chi tiền bốc hàng đi về nhà.": "Sử dụng mô hình hồi quy và phân tích trung gian để kiểm tra các giả thuyết về niềm tin và ý định mua hàng.",
    "Chế Tài Ràng Định Mẫu Số Đa Lô Design": "Thiết kế Khảo sát Định lượng",
    "Chuẩn Viền Bọc Khung Thiết Kế Số Định Ước Dụng Cụ Trọng Hệ": "Thiết kế Khảo sát Định lượng",
    "Chuyên ngành hệ chóp định hình công cụ đả kích thu hẹp lưới Likert kết phối hòa âm các đặc trưng thành tố đã qua tẩy trần chuẩn y rập khuôn trên diện rộng toàn cầu.": "Thiết kế bảng hỏi thang Likert với các thang đo đã được kiểm chứng trong nghiên cứu quốc tế.",
    "Lướt viền mép phép hồi quy, truy gốc nguồn chẻ ranh trung chuyển mắt xích và thẩm thấu độ giáp mặt bằng kiểm thử các ngọn giả định ghim chốt.": "Phân tích hồi quy, kiểm tra vai trò trung gian, và kiểm định giả thuyết nghiên cứu.",
})

# ===== RESEARCH-HOTEL-VI.HTML (Segmentation) =====
print("=== research-hotel-vi.html ===")
patch('research-hotel-vi.html', {
    "Véc-tơ Ngữ nghĩa (Sentence-BERT)": "Phân loại Ngữ nghĩa (BERT)",
})

# ===== Common across all VI files =====
print("=== Common patches ===")
for f in glob.glob('*-vi.html'):
    patch(f, {
        "Trở về Danh mục Dự án": "Quay lại Tất cả Nghiên cứu",
        "Cấu trúc Phương pháp": "Phương pháp Nghiên cứu",
    })

print("\n✅ All jargon simplified!")
