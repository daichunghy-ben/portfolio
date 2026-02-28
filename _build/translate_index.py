import os

def translate_index():
    file_path = "index-vi.html"
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    replacements = {
        # Meta
        "Strategic Data & Consulting Portfolio": "Hồ sơ Dữ liệu Chiến lược & Tư vấn",
        "Data-driven Market Research, Strategy Consulting, and Management Trainee candidate.": "Nghiên cứu Thị trường dựa trên Dữ liệu, Tư vấn Chiến lược, và Ứng viên Quản trị viên Tập sự.",
        
        # Navbar
        ">Education<": ">Học vấn<",
        ">Experience<": ">Kinh nghiệm<",
        ">Research<": ">Nghiên cứu<",
        ">Credentials<": ">Chứng chỉ<",
        ">Skills<": ">Kỹ năng<",
        ">Connect on LinkedIn<": ">Kết nối trên LinkedIn<",
        
        # Hero
        "RESEARCHER · DATA ANALYST": "NGHIÊN CỨU VIÊN · CHUYÊN VIÊN PHÂN TÍCH DỮ LIỆU",
        "Data-driven research": "Nghiên cứu và chiến lược",
        "and strategy.": "dựa trên dữ liệu.",
        "Applied research focusing on experimental design, data analysis, and consumer behavior.": "Nghiên cứu ứng dụng tập trung vào thiết kế thực nghiệm, phân tích dữ liệu, và hành vi người tiêu dùng.",
        "Explore Research": "Khám phá Nghiên cứu",
        "Professional Profile": "Hồ sơ Chuyên môn",
        "Academic and practical research projects": "Dự án nghiên cứu học thuật và thực tiễn",
        "Aspiring Star Prize — Greenovation Research, Swinburne": "Giải thưởng Ngôi sao Triển vọng — Nghiên cứu Khởi nghiệp Xanh, Swinburne",
        "Top Regional Finalist — HSBC Business Case Competition": "Top Chung kết Khu vực — Cuộc thi Giải quyết Tình huống Kinh doanh HSBC",
        
        # About
        "Data Strategist & Researcher": "Chuyên gia Chiến lược Dữ liệu & Nghiên cứu",
        "PROFESSIONAL PROFILE": "HỒ SƠ CHUYÊN MÔN",
        "Background & Methodology": "Nền tảng & Phương pháp luận",
        "A recent Business graduate from Swinburne University specializing in quantitative research. The core methodology relies on systematic data collection, precise analytical frameworks, and objective statistical analysis. Advanced analytical approaches, including NLP and clustering algorithms, are utilized to process and extract insights from large-scale datasets. Major academic and practical projects are developed under the direct supervision of academic mentors and industry professionals to ensure methodological rigor.": "Là cử nhân Khối ngành Kinh doanh từ Đại học Swinburne, với thế mạnh cốt lõi về nghiên cứu định lượng. Phương pháp tiếp cận của tôi dựa trên việc thu thập dữ liệu có hệ thống, xây dựng các khung phân tích chuẩn xác và phân tích thống kê khách quan. Tôi thường xuyên ứng dụng các phương pháp phân tích nâng cao, bao gồm Xử lý ngôn ngữ tự nhiên (NLP) và thuật toán phân cụm, để xử lý và tìm ra những insights giá trị từ các bộ dữ liệu lớn. Các dự án nghiên cứu học thuật lẫn thực tiễn đều được thực hiện dưới sự cố vấn trực tiếp của các giảng viên và chuyên gia trong ngành, nhằm đảm bảo tính chặt chẽ về phương pháp khoa học.",
        "Research Projects": "Dự án Nghiên cứu",
        "Published Papers": "Bài báo Khoa học",
        "Data Points Analyzed": "Hàng nghìn Điểm Dữ liệu Được Phân tích",
        
        # Education
        "ACADEMIC BACKGROUND": "NỀN TẢNG HỌC VẤN",
        "Bachelor of Business": "Cử nhân Kinh doanh",
        "✓ Graduated": "✓ Đã tốt nghiệp",
        "Swinburne University of Technology | Major: Marketing": "Đại học Công nghệ Swinburne | Chuyên ngành: Marketing",
        "Quantitative analytics, experimental design, NLP, and consumer behavior.": "Phân tích định lượng, thiết kế thực nghiệm, NLP, và hành vi người tiêu dùng.",
        "<strong>Coursework:</strong> Statistical Modeling, Consumer Analytics, Quant Research Methods": "<strong>Môn học tiêu biểu:</strong> Mô hình hóa Thống kê, Phân tích Người tiêu dùng, Phương pháp Nghiên cứu Định lượng",
        "<strong>Focus:</strong> A/B Testing, Choice Experiments, NLP applications": "<strong>Trọng tâm:</strong> Thử nghiệm A/B, Thực nghiệm Lựa chọn, Ứng dụng NLP",
        "<strong>Output:</strong> 2 peer-reviewed conference publications before graduation": "<strong>Thành quả:</strong> 2 bài báo được công bố và bình duyệt tại các hội thảo học thuật trước khi tốt nghiệp",
        "High School Diploma": "Bằng Tốt nghiệp Trung học Phổ thông",
        "Trường THPT Việt Anh (Viet Anh High School)": "Trường THPT Nội trú Việt Anh",
        "<strong>SAT:</strong> Top-percentile scoring (Math + Evidence-Based Reading & Writing)": "<strong>SAT:</strong> Điểm số thuộc top cao nhất (Toán + Đọc hiểu & Viết Dựa trên Chứng cứ)",
        "<strong>IELTS Academic:</strong> Band 6.0+": "<strong>IELTS Academic:</strong> 6.0+",
        
        # Experience
        "PROFESSIONAL TIMELINE": "TIẾN TRÌNH CÔNG VIỆC",
        "Work Experience": "Quá trình Công tác",
        "Data Analyst & Strategist": "Chuyên viên Phân tích Dữ liệu & Chiến lược",
        "Da Nang Tourism Project Core": "Dự án Nghiên cứu Du lịch Đà Nẵng",
        "NLP analysis and sentiment evaluation on 100k+ hospitality reviews.": "Phân tích NLP và đánh giá cảm xúc qua hơn 100.000 đánh giá ngành dịch vụ lưu trú.",
        "Hover for details": "Hiển thị chi tiết",
        "<strong>Data Pipeline:</strong> 100k+ review scraping and BERT-based clustering.": "<strong>Xử lý Dữ liệu:</strong> Thu thập hơn 100.000 đánh giá và ứng dụng mô hình BERT để phân cụm.",
        "<strong>Preprocessing:</strong> Developed an 11-step workflow to clean and structure raw textual data.": "<strong>Tiền xử lý:</strong> Phát triển quy trình 11 bước để làm sạch và định dạng lại dữ liệu văn bản thô.",
        "<strong>Strategic Output:</strong> Translated analytical findings into actionable recommendations for regional tourism strategy.": "<strong>Kết quả Chiến lược:</strong> Cụ thể hóa các phát hiện phân tích thành những đề xuất thực tiễn cho định hướng du lịch khu vực.",
        
        "Top Regional Finalist": "Top Chung kết Khu vực",
        "HSBC Business Case Competition 2024 (Swinburne Round)": "Cuộc thi Giải quyết Tình huống Kinh doanh HSBC 2024",
        "Evaluated strategic business cases (e.g., Disney market expansion) within 24-hour constraints.": "Đánh giá các tình huống kinh doanh chiến lược (vd: Xâm nhập thị trường cho Disney) trong giới hạn 24 giờ áp lực.",
        "<strong>Frameworks:</strong> Applied issue trees and structural models to analyze complex business scenarios.": "<strong>Khung phân tích:</strong> Ứng dụng mô hình cây vấn đề và các phương pháp cấu trúc khác để bóc tách những kịch bản kinh doanh phức tạp.",
        "<strong>Strategy Design:</strong> Formulated organizational growth plans that balanced revenue targets with operational capacity limits.": "<strong>Thiết kế Chiến lược:</strong> Lập bản đồ chiến lược tăng trưởng, cân bằng giữa mục tiêu doanh thu và giới hạn năng lực vận hành thực tế.",
        "<strong>Deliverables:</strong> Synthesized quantitative analysis into executive pitch decks for judging panels.": "<strong>Sản phẩm bàn giao:</strong> Đúc kết các bài phân tích phức tạp thành những bản thuyết trình chuyên nghiệp gửi đến hội đồng ban giám khảo.",
        
        "Educational Strategy Consultant": "Chuyên viên Tư vấn Chiến lược Giáo dục",
        "American Study Vietnam": "Tập đoàn Phát triển Giáo dục American Study",
        "Educational consulting for US college admissions, focusing on strategic profiling and application planning.": "Tư vấn thiết kế hồ sơ chiến lược và kế hoạch ứng tuyển cho các trường đại học hàng đầu tại Mỹ.",
        "<strong>Application Strategy:</strong> Directed the development of personalized applicant profiles targeting competitive university criteria.": "<strong>Chiến lược Ứng tuyển:</strong> Trực tiếp định hướng xây dựng hồ sơ cá nhân hóa, bám sát các luồng tiêu chí khắt khe của hội đồng tuyển sinh.",
        "<strong>Client Relations:</strong> Managed end-to-end consulting engagements and advisory processes with students and families.": "<strong>Quan hệ Khách hàng:</strong> Quản lý toàn bộ quy trình tư vấn và tương tác hai chiều xuyên suốt với phụ huynh và học sinh.",
        "<strong>Process Management:</strong> Ensured continuous adherence to structured timeline frameworks from intake to final submission.": "<strong>Quản lý Quy trình:</strong> Theo sát tiến độ làm việc, đảm bảo mọi hạng mục đều tuân thủ nguyên tắc khung thời gian đã đề ra.",
        
        "Academic Research Assistant": "Trợ lý Nghiên cứu Khoa học",
        "University of Economics Ho Chi Minh City (UEH)": "Đại học Kinh tế Thành phố Hồ Chí Minh (UEH)",
        "Consumer behavior research focusing on psychological ownership concepts and experimental pricing models.": "Nghiên cứu hành vi người tiêu dùng, đi sâu vào khái niệm điểm sở hữu tâm lý và các mô hình định giá thực nghiệm.",
        "<strong>Qualitative Research:</strong> Conducted in-depth interviews to conceptualize and formalize consumer decision frameworks.": "<strong>Nghiên cứu Định tính:</strong> Trực tiếp phỏng vấn chuyên sâu (IDI) nhằm phác thảo các khung quyết định của người tiêu dùng.",
        "<strong>Experimental Design:</strong> Structured controlled pricing and menu-design experiments to evaluate willingness-to-pay.": "<strong>Thiết kế Thực nghiệm:</strong> Hệ thống hóa cấu trúc các màn thử nghiệm có kiểm soát về giá và menu để đánh giá sự sẵn lòng chi trả.",
        "<strong>Academic Writing:</strong> Synthesized qualitative and quantitative findings into formal publications for conference proceedings.": "<strong>Viết bài Học thuật:</strong> Tổng hợp các phát hiện tư liệu để cấu trúc thành bài báo khoa học đủ trình độ xuất bản quốc tế.",
        
        "Performance Strategy Lead": "Trưởng mảng Chiến lược Hiệu suất",
        "Swinburne Business Club": "Swinburne Business Club",
        "Led performance tracking, operational initiatives, and member development programs for the university business club.": "Điều phối hoạt động đánh giá hiệu năng, các sáng kiến tối ưu hóa lộ trình làm việc và chắp nối chương trình phát triển thành viên.",
        "<strong>Performance Metrics:</strong> Established and monitored quantifiable KPIs for event success and internal member engagement.": "<strong>Chỉ số KPIs:</strong> Xây dựng và theo dõi bộ chỉ số theo tiến độ nhằm đo đếm sự thành công của sự kiện và mức độ gắn kết nội bộ.",
        "<strong>Team Management:</strong> Directed training curriculum, managed conflict resolution protocols, and oversaw workload distribution to prevent organizational fatigue.": "<strong>Quản lý Đội ngũ:</strong> Lên khung nội dung đào tạo, xử lý mâu thuẫn nhân sự qua các hình thức đàm phán, và cân bằng lượng công việc nhằm giới hạn căng thẳng.",
        
        "VOLUNTEER LEADERSHIP": "KINH NGHIỆM TÌNH NGUYỆN",
        "Operations Coordinator": "Điều phối viên Vận hành",
        "Directed ground operations, logistics, and crisis response protocols for a major regional community event, coordinating a team of 30+ volunteers.": "Kiểm soát tổ chức hiện trường, quản lý hậu cần và xử lý tình huống phát sinh cho một sự kiện mạng lưới cộng đồng, dẫn dắt đội ngũ 30+ tình nguyện viên tích cực.",
        "Expand for impact & responsibilities": "Mở rộng để kiểm tra chi tiết các nhiệm vụ",
        "<strong>Logistics Planning:</strong> Organized venue layout, crowd circulation mechanics, and master schedule coordination for large-scale attendance.": "<strong>Hậu cần Logistics:</strong> Bố trí mặt bằng sự kiện, tính toán luồng di chuyển đám đông thông minh và dàn xếp lịch trình tổng thể cho lượng khách dày đặc.",
        "<strong>Volunteer Coordination:</strong> Managed role deployments, shift rotations, and operational workflows during high-traffic event periods.": "<strong>Hệ thống Trưởng nhóm:</strong> Chỉ huy vòng xoay phân ca, kíp trực và điều hướng các bộ phận khi lượng khách gia tăng lên những mốc đột biến.",
        "<strong>Crisis Resolution:</strong> Addressed on-site operational challenges and interpersonal disputes promptly to maintain event safety and schedule integrity.": "<strong>Giải quyết Khủng hoảng:</strong> Kịp thời xử lý các sự cố vận hành tại hiện trường và xoa dịu xung đột phòng ban, giảm thiểu những sự vụ ngoài ý muốn.",
        
        # Methodology
        "RESEARCH SKILLS": "KỸ NĂNG NGHIÊN CỨU",
        "How I Do Research": "Cách Tôi Cấu trúc Vấn Đề",
        "Every project starts with the right method. Here are the approaches I've applied across 9 research projects.": "Sự thành công của một dự án bắt nguồn từ phương pháp tiếp cận chuẩn xác. Dưới đây là những kỹ thuật tôi đã ứng dụng linh qua qua 9 báo cáo chuyên sâu.",
        "NLP & Text Mining": "NLP & Khai phá Văn bản Dữ liệu",
        "Sentiment analysis, topic modeling, and text classification on large review datasets.": "Các mô hình phân tích cảm xúc, khái quát hóa chủ đề, và định tuyến văn bản trên tập dữ liệu đồ sộ từ internet.",
        "Survey Design & SEM": "Thiết kế Khảo sát & Mô hình SEM",
        "Designing quantitative surveys and testing causal relationships with structural models.": "Xây dựng bảng hỏi định lượng và kiểm định các mối quan hệ nguyên nhân - kết quả thông qua cấu trúc mô hình có đối hướng.",
        "Experimental Design": "Cấu trúc Form Thực nghiệm",
        "A/B testing, between-group experiments, and discrete choice experiments for behavioral research.": "Thiết kế mô hình giả định A/B Testing, đối chiếu nhóm phân mảng, và tạo ra các thử nghiệm lựa chọn rời rạc trong nghiên cứu hành vi.",
        "Clustering & Segmentation": "Phân cụm Dữ liệu & Phân khúc",
        "Identifying hidden patterns and grouping consumers by behavior, values, or preferences.": "Nhận diện những điểm chung ẩn giấu và phân loại nhóm người tiêu dùng dựa trên cách họ hành xử, hệ giá trị cốt lõi, hoặc thị hiếu.",
        "Econometrics & WTP": "Kinh tế Lượng & Ước tính WTP",
        "Regression analysis, conjoint studies, and willingness-to-pay estimation for policy and market research.": "Sử dụng phân tích hồi quy, nghiên cứu hợp thể định luật, và lượng hóa mức độ sẵn lòng chi trả để phục vụ cho phân tích thị trường.",
        "Data Storytelling": "Kể chuyện Bằng Dữ liệu Trực quan",
        "Turning data into clear visuals and actionable insights for teams and stakeholders.": "Biến những con số khô khan thành hình ảnh có ý nghĩa và các góc nhìn (insights) dễ áp dụng cho đội ngũ và các đối tác liên quan.",
        "Applied across <strong style=\"color: var(--text-primary);\">9 research projects</strong> in consumer behavior, hospitality, public policy, and behavioral economics.": "Ứng dụng xuyên suốt trên <strong style=\"color: var(--text-primary);\">9 dự án thực tế nghiên cứu</strong> về hành vi tiêu dùng, dịch vụ lưu trú kinh doanh, chính sách công và kinh tế học hành vi cơ bản.",
        "See All Research Projects": "Xem Toàn bộ Các Dự án Nghiên cứu",
        
        # Awards
        "MILESTONES": "CỘT MỐC GHI NHẬN",
        "Awards & Achievements": "Giải thưởng & Thành tựu Đáng chú ý",
        "Participant - Screening Round": "Người tham gia - Vòng Lọc Trực tiếp",
        "Selected to compete in the regional screening round, solving complex consulting cases under strict time constraints. Presented strategic solutions to industry judges.": "Nằm trong số những đại diện tham gia vòng sơ tuyển cấp khu vực, trực tiếp giải quyết những kịch bản kinh doanh đa chiều chỉ với thời hạn ít ỏi. Từ trượng trình bày giải pháp trước các chuyên gia trong ngành.",
        "Swinburne Academic Scholarship": "Học bổng Học thuật Swinburne Trị giá 20%",
        "Merit-Based Award": "Giải thưởng Năng lực Cá nhân",
        "Awarded partial scholarship for Bachelor of Business program based on outstanding high school academic performance and entrance examinations.": "Được trao học bổng bán phần cho các cấp bậc đào tạo Cử nhân Kinh doanh dựa trên thành tích học tập cấp ba xuất sắc vượt rào và những điểm số bài bản.",
        "Best Performance Awards": "Giải thưởng Cá nhân Tiêu biểu Đại học (Best Performance)",
        "Recognized for top academic performance across multiple semesters and core business units.": "Nhiều lần được nhà trường vinh danh nhờ thành tích học tập vượt trội xuyên suốt các học kì quan trọng, đóng góp lớn vào chất lượng học vụ chuyên ngành chung.",
        
        # Credentials
        "PROVEN RECORD": "CHỨNG NHẬN CHUYÊN MÔN",
        "Publications": "Các Tác phẩm Xuất bản",
        "Exploring Nutrition Knowledge, Physical Activity, and Dietary Intake among Vietnamese University Students": "Khám phá Mối quan hệ giữa Kiến thức Dinh dưỡng, Hoạt động Thể chất, và Lượng Thực phẩm Tiêu thụ ở Sinh viên Đại học Việt Nam",
        "Exploring the Effect of Social Media Content of Virtual Influencers on Generation Z's Purchase Intention: An Elaboration Likelihood Model Approach": "Đánh giá Tác động của Nội dung Mạng Xã hội từ KOL Ảo lên Ý định Tiêu dùng: Cách tiếp cận theo Mô hình Khả năng Mở rộng (ELM)",
        "Certifications": "Các loại Chứng chỉ",
        "IELTS Academic (6.0+)": "IELTS Academic (6.0+)",
        "SAT Top-Percentile": "SAT Top-Percentile Điểm Số",
        "ICDL Digital Literacy": "ICDL Thông thạo Máy tính Căn bản",
        
        # Skills
        "TOOLKIT": "BỘ CÔNG CỤ THỰC CHIẾN",
        "Core Competencies": "Những Năng Lực Trọng Tâm",
        "Categorized technical and strategic capabilities structured for practical deployment.": "Bộ kỹ năng được sắp xếp và sàng lọc tốc độ giúp quá trình thích ứng cực cao nhằm linh động trong hoạt động thực chiến dự án.",
        "Technical Skills": "Kỹ thuật Nghiệp vụ",
        "Research & Strategy": "Tư duy Chiến lược & Phân tích",
        "Soft Skills": "Kỹ năng Làm việc Mềm mại",
        "Python (Pandas, Numpy)": "Python (Pandas, Numpy)",
        "SQL / ETL Pipelines": "Cấu trúc SQL / Biến đổi ETL",
        "NLP (RoBERTa, NLTK)": "Diễn dịch NLP (RoBERTa, NLTK)",
        "PowerBI / Tableau / Excel": "PowerBI / Tableau / Excel Mở rộng",
        "Git Version Control": "Kiểm soát Version / Git",
        "Survey & Experimental Design": "Thiết kế và Giám sát Khảo sát",
        "Market Benchmarking": "Quy chiếu Chỉ số Đối thủ",
        "Consumer Behavior Modeling": "Đo lường Hành vi Tập khách hàng",
        "Issue Trees / MECE": "Phân lách MECE trực quan",
        "Statistical Testing (ANOVA, SEM)": "Đánh mô hình chuẩn (ANOVA, SEM)",
        "Cross-Functional Leadership": "Giải pháp Lãnh đạo Đa khối lượng",
        "Conflict Resolution": "Điều hòa và Khắc phục sự cố",
        "Executive Data Storytelling": "Trình diễn Thuyết minh theo Data",
        "Operations Management": "Thao tác Quản trị hệ thống Vận hành",
        
        # Footer
        "Get in touch.": "Khoan vội rời đi nhé.",
        "Download the full resume or connect on LinkedIn to discuss research and data strategy.": "Chúng ta có thể đồng hành bằng cách tải phiên bản lý lịch hoàn chỉnh hoặc bấm nút kết nối qua mạng lưới LinkedIn để cùng nhau chia sẻ sâu sắc hơn về mọi dự án nghiên cứu cũng như chiến lược kinh doanh ngàn đô.",
        "Download Full Resume (CV)": "Tải về Bản Full PDF CV",
    }
    
    # Simple search and replace
    for en_text, vi_text in replacements.items():
        content = content.replace(en_text, vi_text)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Translated {file_path}")

if __name__ == '__main__':
    translate_index()

