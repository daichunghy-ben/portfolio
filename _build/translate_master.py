import os
import shutil
import re
import glob

def map_links(html_content):
    """
    Update internal HTML links to point to the -vi.html version.
    E.g., href="projects.html" -> href="projects-vi.html"
    But avoid modifying absolute links or external links.
    """
    # Find all .html links
    links = re.findall(r'href="([^"]+\.html)(#[^"]*)?"', html_content)
    unique_links = list(set([link[0] for link in links]))
    
    for link in unique_links:
        # Ignore external links
        if link.startswith('http') or '-vi.html' in link:
            continue
        
        # Determine replacing string
        new_link = link.replace('.html', '-vi.html')
        # Replace only in href
        html_content = re.sub(rf'href="{link}"', f'href="{new_link}"', html_content)
        html_content = re.sub(rf'href="{link}#', f'href="{new_link}#', html_content)
        
    return html_content

def update_lang_switcher(html_content, en_file):
    """
    Updates the language switcher to show VI as active and ensures EN link stays .html.
    """
    # Set EN button to link back to the un-translated page and remove 'active'
    html_content = re.sub(
        r'<a href="[^"]+\.html" class="lang-btn[^"]*">EN</a>',
        f'<a href="{en_file}" class="lang-btn">EN</a>',
        html_content
    )
    # Set VI button to link to the translated page and add 'active'
    vi_file = en_file.replace('.html', '-vi.html')
    html_content = re.sub(
        r'<a href="[^"]+-vi\.html" class="lang-btn[^"]*">VI</a>',
        f'<a href="{vi_file}" class="lang-btn active">VI</a>',
        html_content
    )
    return html_content

def translate():
    # List all main html files
    all_files = glob.glob('*.html')
    en_files = [f for f in all_files if not f.endswith('-vi.html') and f != 'cv.html']
    
    dict_global = {
        # Meta & Header
        "Strategic Data & Consulting Portfolio": "Hồ sơ Dữ liệu Chiến lược & Tư vấn",
        "Data-driven Market Research, Strategy Consulting, and Management Trainee candidate.": "Ứng viên Phân tích Dữ liệu, Tư vấn Chiến lược và Quản trị viên Tập sự.",
        
        # Nav
        ">Education<": ">Học vấn<",
        ">Experience<": ">Kinh nghiệm<",
        ">Projects<": ">Nghiên cứu<",
        ">Credentials<": ">Chứng chỉ<",
        ">Skills<": ">Kỹ năng<",
        "Connect on LinkedIn": "Kết nối trên LinkedIn",
        
        # General Footer & Actions
        "Download Full Resume (CV)": "Tải Hồ sơ Đầy đủ (CV)",
        "Let's build something.": "Kiến tạo Giá trị.",
        "Review my complete background or reach out to explore how I can help your team.": "Khám phá chi tiết hồ sơ năng lực hoặc kết nối trực tiếp để thảo luận về tiềm năng hợp tác.",
        
        # Hero Index
        "DATA STRATEGIST · RESEARCHER · STORYTELLER": "CHUYÊN GIA DỮ LIỆU · NGHIÊN CỨU VIÊN",
        "Portfolio.": "Hồ sơ Năng lực.",
        "Transforming complex data into compelling narratives.": "Chuyển hóa dữ liệu phức tạp thành chiến lược kinh doanh.",
        "Bridging analytical rigor and creative storytelling. Designing intuitive, human-centric strategies that drive cross-functional impact.": "Kết hợp tính chuẩn xác trong phân tích dữ liệu và thiết kế chiến lược xoay quanh con người nhằm thúc đẩy sự phát triển toàn diện của tổ chức.",
        "Explore My Research": "Khám phá Nghiên cứu",
        "My Story": "Câu chuyện",
        "Data ready for the team to use.": "Dữ liệu đã sẵn sàng cho nhóm phân tích.",
        
        # About
        "Data Strategist & Researcher": "Chuyên gia Dữ liệu & Nghiên cứu",
        "ABOUT ME": "GIỚI THIỆU",
        "Connecting Data with Human Behavior": "Kết nối Dữ liệu Tự nhiên với Hành vi Con người",
        "I specialize in consumer analytics, NLP, and experimental design. My work centers on transforming complex datasets into actionable business narratives. Whether conducting deep-dive market segmentations or building scalable research frameworks, I bridge the gap between analytical rigor and strategic execution.": "Chuyên môn cốt lõi nằm ở phân tích hành vi người tiêu dùng, Xử lý Ngôn ngữ Tự nhiên (NLP) và thiết kế thực nghiệm. Trọng tâm là chuyển hóa các tập dữ liệu phức tạp thành các giải pháp kinh doanh mang tính thực tiễn. Từ quy trình phân khúc thị trường chuyên sâu đến thiết lập các khung nghiên cứu ở quy mô lớn, cầu nối giữa khả năng phân tích chặt chẽ và năng lực thực thi chiến lược luôn được đảm bảo duy trì.",
        "Years Field Experience": "Năm Kinh nghiệm Thực tế",
        "Reviews Analyzed": "Đánh giá được Phân tích",
        "Prize Swinburne Award": "Giải Nhất Swinburne",
        
        # Education
        "Academic Background.": "Nền tảng Học vấn.",
        "The foundation.": "Bước khởi đầu vững chắc.",
        "✓ Graduated": "✓ Đã Tốt nghiệp",
        "Quantitative analytics, experimental design, NLP, and consumer behavior.": "Phân tích định lượng, thiết kế thực nghiệm, NLP, và hành vi người tiêu dùng.",
        "Coursework:": "Môn học tiêu biểu:",
        "Statistical Modeling, Consumer Analytics, Quant Research Methods": "Mô hình hóa Thống kê, Phân tích Người tiêu dùng, Phương pháp Nghiên cứu Định lượng",
        "Focus:": "Trọng tâm:",
        "A/B Testing, Choice Experiments, NLP applications": "Thử nghiệm A/B, Thực nghiệm Lựa chọn, Ứng dụng NLP",
        "Output:": "Thành quả:",
        "2 peer-reviewed conference publications before graduation": "2 bài báo khoa học được công bố tại hội thảo quốc tế trước khi tốt nghiệp",
        "High School Diploma": "Bằng Tốt nghiệp THPT",
        "Top-percentile scoring (Math + Evidence-Based Reading & Writing)": "Điểm số nhóm cao nhất (Toán + Đọc hiểu & Viết Dựa trên Chứng cứ)",
        "Trường THPT Việt Anh (Viet Anh High School)": "Trường THPT Việt Anh",
        
        # Experience
        "Professional Timeline.": "Tiến trình Sự nghiệp.",
        "Impact over time.": "Dấu ấn qua thời gian.",
        "Data Analyst & Strategist": "Chuyên viên Phân tích Dữ liệu & Chiến lược",
        "Da Nang Tourism Project Core": "Dự án Cốt lõi Du lịch Đà Nẵng",
        "End-to-end NLP analytics on 100k+ hospitality reviews.": "Thực hiện phân tích NLP toàn diện trên bộ dữ liệu hơn 100.000 đánh giá ngành lưu trú.",
        "Hover for details": "Trỏ chuột xem chi tiết",
        "Data Pipeline:": "Xử lý Dữ liệu:",
        "100k+ review scraping and BERT-based clustering.": "Thu thập hơn 100.000 phản hồi và ứng dụng mô hình BERT để phân cụm.",
        "Algorithmic Cleaning:": "Chuẩn hóa Thuật toán:",
        "11-step cleaning protocol for unstructured text.": "Thiết lập quy trình 11 bước nhằm làm sạch và định dạng dữ liệu văn bản thô.",
        "Strategy Execution:": "Thực thi Chiến lược:",
        "Converting sentiment into urban policy fixes.": "Chuyển hóa cảm xúc khách hàng thành các đề xuất cải thiện định hướng đô thị.",
        
        "Top Regional Finalist": "Top Chung kết Khu vực",
        "HSBC Business Case Competition 2024 (Swinburne Round)": "Cuộc thi Giải quyết Tình huống Kinh doanh HSBC 2024",
        "Strategic consulting cases (Disney/Disneyland expansion) under 24-hour deadlines.": "Giải quyết các tình huống tư vấn chiến lược (vd: Xâm nhập thị trường Disney) trong giới hạn 24 giờ.",
        "MECE Frameworks:": "Khung cấu trúc MECE:",
        "Issue Trees for breaking down corporate dossiers.": "Ứng dụng sơ đồ cây để bóc tách và phân tích các hồ sơ doanh nghiệp.",
        "Go-to-Market:": "Chiến lược Thâm nhập:",
        "Revenue growth balanced with operational constraints.": "Cân bằng tăng trưởng doanh thu với các rào cản vận hành.",
        "Executive Pitch:": "Thuyết trình Cấp cao:",
        "Quantitative analysis into C-suite presentations.": "Đúc kết phân tích định lượng thành các buổi thuyết trình cho ban giám đốc.",
        
        "Educational Strategy Consultant": "Chuyên gia Tư vấn Chiến lược Giáo dục",
        "B2C consulting for elite US College admissions. Strategic profiling for HNW clients.": "Tư vấn hồ sơ ứng tuyển vào các trường đại học hàng đầu của Mỹ. Thiết kế hồ sơ chiến lược cho nhóm khách hàng đại diện tài sản lớn.",
        "Strategic Profiling:": "Xây dựng Hồ sơ:",
        "Unique narrative construction for Ivy League criteria.": "Cấu trúc câu chuyện cá nhân độc đáo đáp ứng tiêu chí nhóm trường Ivy League.",
        "Client Management:": "Quản lý Khách hàng:",
        "Managing high-net-worth relationships (students & parents).": "Quản lý và duy trì quan hệ với nhóm khách hàng mang tài sản lớn (phụ huynh và học sinh).",
        "Contract Execution:": "Nghiệm thu Quy trình:",
        "Supported rigorous educational consulting frameworks.": "Hỗ trợ thực thi chặt chẽ quy trình tư vấn giáo dục định chuẩn.",
        
        "Academic Research Assistant": "Trợ lý Nghiên cứu Học thuật",
        "Consumer behavior research on 'Psychological Ownership' and predictive pricing.": "Nghiên cứu hành vi tiêu dùng dựa trên 'Sở hữu Tâm lý' và mô hình định giá dự báo.",
        "Qualitative IDI:": "Phỏng vấn Sâu (IDI):",
        "Depth interviews to build consumer behavior frameworks.": "Thực hiện phỏng vấn chuyên sâu để xây dựng khung hành vi người tiêu dùng.",
        "Pricing Strategy:": "Chiến lược Giá:",
        "Designed buffet-pricing experiments testing WTP.": "Thiết kế các thực nghiệm giá buffet để đo lường mức độ Sẵn sàng Chi trả (WTP).",
        "Synthesis:": "Tổng hợp Dữ liệu:",
        "Translating raw behavior data into formal academic outputs.": "Biến đổi dữ liệu hành vi thô thành các báo cáo học thuật chính thức.",
        
        "Performance Strategy Lead": "Trưởng nhóm Chiến lược Hiệu suất",
        "Operational efficiency & member development for premier university business org.": "Tối ưu hóa vận hành & phát triển năng lực thành viên tại tổ chức kinh doanh sinh viên học thuật.",
        "KPIs:": "Chỉ số Hiệu suất:",
        "Replaced abstract buzzwords with actionable, measurable metrics.": "Chuyển hóa ngôn từ trừu tượng thành các chỉ số đo lường cụ thể và khả thi.",
        "Mentoring:": "Định hướng:",
        "Junior skills development, conflict resolution, anti-burnout ops.": "Đào tạo kỹ năng thực tiễn, giải quyết xung đột, và triển khai chiến dịch chống kiệt sức.",
        
        "VOLUNTEER LEADERSHIP": "KINH NGHIỆM TÌNH NGUYỆN",
        "Operations Coordinator": "Điều phối viên Vận hành",
        "Managed ground operations, logistics, and crisis response for one of the region's largest community events, leading a cross-functional team of over 30 volunteers.": "Đảm nhiệm vận hành hiện trường, quản lý hậu cần và xử lý khủng hoảng tại một trong những sự kiện cộng đồng quy mô nhất khu vực, dẫn dắt đội ngũ 30+ tình nguyện viên.",
        "Expand for impact & responsibilities": "Mở rộng để xem tác động & trách nhiệm",
        "Strategic Planning:": "Hoạch định Chiến lược:",
        "Coordinated end-to-end logistics, from venue setup to crowd control mapping, ensuring seamless execution for hundreds of attendees.": "Điều phối toàn bộ hậu cần, từ thiết lập không gian đến phân luồng đám đông, đảm bảo chu trình hoạt động trơn tru cho hàng trăm người tham dự.",
        "Team Leadership:": "Lãnh đạo Đội ngũ:",
        "Directed and motivated a diverse team of 30+ volunteers through intensive, fast-paced event day operations.": "Điều hành và truyền cảm hứng cho đội ngũ 30+ tình nguyện viên vượt qua nhịp độ làm việc dày đặc trong ngày sự kiện.",
        "Crisis Management:": "Xử lý Khủng hoảng:",
        "Handled real-time operational bottlenecks and community conflict resolution under high pressure, maintaining a safe and inclusive environment.": "Giải quyết các nút thắt vận hành tức thời và điều hòa mâu thuẫn cộng đồng dưới áp lực cao, duy trì môi trường an toàn và cởi mở.",
        
        # Awards
        "MILESTONES": "CỘT MỐC",
        "Awards & Achievements": "Giải thưởng & Thành tựu",
        "Participant - Screening Round": "Người tham dự - Vòng Khảo thí",
        "Selected to compete in the regional screening round, solving complex consulting cases under strict time constraints. Presented strategic solutions to industry judges.": "Vượt qua vòng loại để cạnh tranh tại khu vực, giải quyết nhanh các tình huống kinh doanh phức tạp dưới giới hạn thời gian hạn hẹp. Thuyết trình giải pháp chiến lược trước các giám khảo.",
        "Swinburne Academic Scholarship": "Học bổng Học thuật Swinburne Trị giá 20%",
        "Merit-Based Award": "Giải thưởng Năng lực Cá nhân",
        "Awarded partial scholarship for Bachelor of Business program based on outstanding high school academic performance and entrance examinations.": "Nhận học bổng từ quy chế đào tạo Cử nhân Kinh doanh, đánh giá qua thành tích xuất sắc tại môi trường trung học và hệ thống bài thi tuyển.",
        "Best Performance Awards": "Giải thưởng Sinh viên Có Thành tích Đào tạo Xuất sắc Nhất",
        "Recognized for top academic performance across multiple semesters and core business units.": "Nhiều lần được công nhận là cá nhân dẫn đầu về kết quả học tập ở các học kỳ liên tiếp và hệ thống chuyên ngành nòng cốt.",
        
        # Proven Record & Credentials
        "PROVEN RECORD": "CHỨNG NHẬN DẤU ẤN",
        "Publications": "Công bố Khoa học",
        "Certifications": "Chứng chỉ Chuyên môn",
        "EV Adoption - Choice Experiments": "Thúc đẩy Chấp nhận xe Điện - Các Nhu cầu Ưu tiên",
        "Virtual Influencers & Gen Z Trust": "Sự Tín nhiệm Đối với Người có Sức Ảnh hưởng Ảo ở Gen Z",
        "Swinburne Scholarship": "Học bổng Xuất sắc Swinburne",
        "IELTS Academic (7.5+)": "IELTS Academic (7.5+)",
        "SAT Top-Percentile": "SAT Nhóm Top Cao nhất",
        "ICDL Digital Literacy": "ICDL Chuyên môn Máy tính",
        "View SAT Score Report": "Xem Phiếu Điểm SAT",
        "View ICDL Certificate": "Xem Chứng chỉ ICDL",
        
        # Toolkits
        "Core Competencies.": "Năng lực Cốt lõi.",
        "Technical and strategic capabilities.": "Tổng hợp kỹ thuật nghiệp vụ và tư duy chiến lược.",
        "Technical Skills": "Kỹ thuật Nghiệp vụ",
        "Research & Strategy": "Tư duy Chiến lược & Nghiên cứu",
        "Soft Skills": "Kỹ năng Mềm",
        "Python (Pandas, Numpy)": "Python (Pandas, Numpy)",
        "SQL / ETL Pipelines": "Cấu trúc SQL / Biến đổi ETL",
        "NLP (RoBERTa, NLTK)": "Phân tích NLP (RoBERTa, NLTK)",
        "Clustering (GMM, K-Means)": "Phân cụm Dữ liệu (GMM, K-Means)",
        "PowerBI / Tableau / Excel": "PowerBI / Tableau / Excel Mở rộng",
        "Git Version Control": "Kiểm soát Phiên bản Git",
        "Survey & Experimental Design": "Thiết kế Phương pháp Thực nghiệm & Khảo sát",
        "Market Benchmarking": "Quy chiếu Điểm chuẩn Thị trường",
        "Consumer Behavior Modeling": "Mô hình hóa Hành vi Tập khách hàng",
        "Issue Trees / MECE": "Phân tích Sơ đồ Cây / MECE",
        "Statistical Testing (ANOVA, SEM)": "Kiểm định Thống kê (ANOVA, SEM)",
        "Cross-Functional Leadership": "Lãnh đạo Đa chức năng",
        "Conflict Resolution": "Điều hòa Xung đột",
        "Executive Data Storytelling": "Khả năng Dẫn chuyện qua Dữ liệu Trực quan",
        "Operations Management": "Quản trị Vận hành",
        
        # Projects Page Highlights
        "Research Lab.": "Nghiên cứu Chuyên sâu.",
        "Applied research solving real business problems.": "Quy trình nghiên cứu giải quyết các bài toán kinh doanh cốt lõi.",
        "Virtual Influencers & Gen Z Trust": "KOL Ảo & Lòng tin Gen Z",
        "Analyzed trust-building mechanisms between Generation Z and AI-generated KOLs.": "Phân tích cơ chế xây dựng lòng tin ở Generation Z đối với tệp KOL nhân tạo.",
        "Quantitative Survey": "Khảo sát Định lượng",
        "Statistical Modeling": "Mô hình Thống kê",
        "Hotel Market Segmentation": "Phân khúc Thị trường Dịch vụ Khách sạn",
        "Uncovered market dynamics using NLP and GMM to cluster 100,000+ guest reviews.": "Khám phá quy luật thị trường bằng hướng tiếp cận NLP và GMM thông qua hơn 100,000 đánh giá.",
        "Clustering (GMM)": "Thuật toán Phân cụm (GMM)",
        "EV Adoption Strategies": "Chiến lược Thâm nhập Thị trường Xe điện (EV)",
        "Modeled consumer willingness-to-pay for EV attributes using choice experiments and market simulation.": "Mô phỏng mức độ Sẵn sàng Chi trả của người tiêu dùng đối với các thuộc tính xe điện qua mô phỏng thị trường và Thực nghiệm lựa chọn.",
        "Choice Experiment": "Thực nghiệm Lựa chọn",
        "WTP Analysis": "Phân tích WTP",
        "Market Simulation": "Mô phỏng Thị trường",
        "Econometrics": "Kinh tế Lượng",
        "Psychological Ownership": "Hiệu ứng Sở hữu Tâm lý",
        "Investigated how individual and collective ownership drives affective commitment.": "Theo dõi trạng thái sở hữu cá nhân và tập thể tác động lên những cam kết nội bộ về quyền sở hữu.",
        "Quantitative Research": "Nghiên cứu Định lượng",
        "Buffet Menu Nudging": "Nút thắt Tâm lý Tiêu dùng Buffet",
        "Tested 'Healthier Options First' (HOF) sequencing to reduce intended calorie intake.": "Bố trí quy luật 'Healthier Options First' (HOF) mục tiêu thuyên giảm số lượng calorie vô thức tiêu thụ.",
        "Arts Workshop Co-creation": "Xác lập Trải nghiệm Hội thảo Nghệ thuật",
        "Assessed how hedonic and social values influence participation in creative edutainment.": "Khám phá sự ảnh hưởng từ giá trị cảm xúc đến mô hình giáo dục giải trí (Edutainment).",
        "Value Framework": "Lưới Cấu trúc Giá trị",
        "Drag to scroll": "Kéo để lướt xem",
        
        # Hotel Case Study
        "Case Study: Hotel Market Segmentation.": "Nghiên cứu Nổi bật: Phân khúc Khách sạn.",
        "From raw reviews to actionable strategy.": "Từ tập đánh giá thô dẫn đến thiết lập chiến lược.",
        "The Challenge": "Vấn Đề Đặt Ra",
        "Traditional hotel segmentation relies on static demographics, failing to capture the nuanced, dynamic preferences of modern travelers. Da Nang's competitive hospitality market required a data-driven approach to understand true competitive advantages and identify latent customer needs. The objective was to segment the market strictly based on what guests vocally value most and least.": "Cách phân chia đối tượng mục tiêu hiện tại thường bị áp đặt bởi nhân khẩu học tĩnh, khiến tổ chức bỏ qua dòng nhu cầu đa dạng từ nhóm khách du lịch kỉ nguyên số. Với mức độ cạnh tranh khốc liệt tại thị trường lưu trú Đà Nẵng, việc áp dụng công nghệ dữ liệu để xác định chính xác lợi thế cạnh tranh và thói quen tiềm ẩn trở nên cấp thiết. Mục tiêu chính là phân khúc khách hàng dựa trên những tiêu chí họ trân trọng hoặc chê bình.",
        "Data Collection": "Thu thập Dữ liệu",
        "Scraped and cleaned 74,896 English reviews across 492 hotels in Da Nang.": "Khai thác và làm sạch 74,896 đánh giá bằng tiếng Anh của 492 khách sạn khu vực Đà Nẵng.",
        "NLP Feature Eng.": "Trích xuất Đặc trưng NLP",
        "Aspect-Based Sentiment Analysis isolating Ambiance, Cleanliness, F&B, Facilities, Location, Room, Service, Value.": "Sử dụng Phân tích Cảm xúc theo Khía cạnh (ABSA) để phân dải các tiêu chí: Không khí, Vệ sinh, F&B, Tiện ích, Vị trí, Phòng ốc, Dịch vụ, và Cấu trúc Giá trị Lợi nhuận.",
        "GMM Clustering": "Phân Nhóm GMM",
        "Applied Gaussian Mixture Models on aspect salience vs baseline to uncover 10 distinct profiles.": "Ứng dụng thuật toán Gaussian Mixture Models (GMM) đối chiếu lên dải tham chiếu để phác họa 10 nhóm khách riêng biệt.",
        "Key Findings & Visuals": "Phát hiện Tiêu biểu & Biểu đồ",
        "Segment Signatures (Contrast to Market)": "Dấu ấn Đặc trưng (Quy chiếu Thị trường)",
        "Each segment exhibits a unique \"signature\" of over-indexed and under-indexed priorities. For example, Segment 0 (Premium) heavily prioritizes Ambiance to drive positive scores, while Segment 4 hyper-focuses on Cleanliness and Room quality, largely driving their critical reviews.": "Sự chênh lệch chỉ số cho thấy mỗi phân khúc mang một \"chữ ký đặc trưng\". Ví dụ, Phân khúc 0 (Cao cấp Premium) coi trọng Không gian để thiết lập xếp hạng, trái ngược với Phân khúc 4 luôn bị mẫn cảm bởi tiêu chuẩn Vệ sinh và Phòng ốc, khởi tạo lượng phê bình lớn.",
        "Strategic Portfolio Positioning": "Định Vị Tệp Khách hàng Chiến Lược",
        "Mapping segments by Overall Evaluation against Attention Concentration clarifies strategic targeting. Segment 3 represents highly loyal, singular-focus guests, while Segment 4 represents highly critical, widely-focused guests that present high reputational risk.": "Đối chiếu tỷ lệ Đánh giá Trung bình lên Mật độ Quan tâm đã thiết lập vị trí từng nhóm một cách chiến lược. Phân khúc 3 thể hiện sự trung thành đối với một dòng tiện ích, trong khi Phân khúc 4 luôn thể hiện tính phán xét, dễ phân tâm nhưng tiềm tàng rủi ro truyền thông nghiêm trọng.",
        "Isolating Deal-Breakers": "Khoanh Vùng Lỗi Vận Hành Chí Mạng",
        "By analyzing negative aspect salience, we isolate structural pain points. Segment 1 (Explorers) shows dissatisfaction concentrated in Service, while Segment 4 shows severe multi-dimensional friction in Cleanliness and Rooms.": "Quá trình phân tách cường độ chê trách đã cho thấy chính xác những điểm mù cần vá lấp. Phân khúc 1 (Đoàn Khách Thám hiểm) bộc lộ sự bất mãn xoay quanh Hệ thống Dịch vụ, trong khi Nhóm số 4 nảy sinh mâu thuẫn hệ thống rộng hơn do các vấn đề vệ sinh buồng phòng.",
        "View Full PDF Report": "Xem Đầy Đủ Báo Cáo Định Dạng PDF",
        
        # EV Case Study
        "EV Adoption & Consumer Choice.": "Chấp Nhận Xu Hướng Ô tô Điện (EV) & Lựa Chọn Của Khách Hàng.",
        "A conjoint-based study modeling how Vietnamese consumers value electric vehicle attributes.": "Dự án Conjoint-based mô phỏng cách người tiêu dùng Việt Nam đánh giá các thuộc tính xe điện.",
        "Research Methodology": "Cấu trúc Mô Hình Thực Nghiệm",
        "Choice Experiment Design": "Thiết Kế Khung Lựa Chọn",
        "Designed hypothetical EV profiles varying car design, brand, range, and price attributes using fractional factorial design.": "Thiết kế các mẫu xe điện giả định thay đổi theo mẫu mã, thương hiệu, phạm vi hoạt động và giá thành bằng phương pháp phân mảnh nhân tố.",
        "Willingness-to-Pay (WTP)": "Mức độ Sẵn Lòng Chi Trả (WTP)",
        "Estimated consumers' marginal WTP for each attribute level using conditional logit and mixed logit models.": "Ước tính mức WTP ký biên cho từng thuộc tính thông qua mô hình Conditional Logit và Mixed Logit.",
        "Market Simulation": "Mô phỏng Dòng Thị trường",
        "Simulated competitive market scenarios to predict adoption share for different EV configurations against existing alternatives.": "Khởi chạy mô phỏng cạnh tranh để dự báo tỷ trọng tiêu dùng cho các cấu hình xe điện khác nhau khi đặt lên bàn cân với các lựa chọn thay thế hiện có.",
        "Skills Applied": "Các Kiến Thức Ứng Dụng",
        "Constructed balanced choice sets with D-optimal efficiency for realistic trade-off evaluation.": "Bảo toàn cấp độ tùy chỉnh bằng thuật toán D-optimal nhằm củng cố độ chân thực cho phương thức đánh giá thỏa hiệp.",
        "Econometric Modeling": "Mô Hình Kinh Tế Lượng",
        "Applied discrete choice models (conditional logit, mixed logit) to estimate preference parameters and WTP.": "Ứng dụng phân bố mô hình rời rạc (Conditional Logit, Mixed Logit) để trích xuất trọng số và giới hạn WTP.",
        "Product Design Analysis": "Thẩm Định Góc Nhìn Sản Phẩm",
        "Evaluated how car aesthetics (SUV vs. sedan, color, interior) influence consumer preference and premium WTP.": "Thẩm định sự ảnh hưởng của thiết kế ô tô (SUV vs. sedan, màu sắc, nội thất) lên ưu tiên tiêu dùng và mức WTP bổ sung.",
        "Projected competitive adoption scenarios to identify optimal price-feature bundles for market entry strategies.": "Dự phóng các kịch bản cạnh tranh tiêu dùng nhằm xác lập chuỗi tính năng-giá tích hợp phù hợp cho chiến lược xâm nhập thị trường.",
        "Supervised by": "Hướng dẫn bởi",
        "Published at": "Công bố báo cáo tại",
        "Co-authored": "Đồng tác giả",
    }
    
    for en_file in en_files:
        vi_file = en_file.replace('.html', '-vi.html')
        
        # Read Original
        with open(en_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Execute String Replacements with Regex to handle mid-sentence line breaks
        sorted_keys = sorted(dict_global.keys(), key=len, reverse=True)
        for key in sorted_keys:
            val = dict_global[key]
            # Create regex that matches any whitespace character \s+ instead of just space
            key_regex = r'\s+'.join(map(re.escape, key.split()))
            # Ensure we only replace using regex if there's actually a match. 
            # re.sub with string that has no match returns original content.
            if key.strip():
                content = re.sub(key_regex, val, content)
            
        # Update Links to -vi version
        content = map_links(content)
        
        # Update Language switcher (done AFTER map_links so we can force EN to be clean)
        content = update_lang_switcher(content, en_file)
        
        # Write Translated
        with open(vi_file, 'w', encoding='utf-8') as f:
            f.write(content)
            
        print(f"Generated and Translated: {vi_file}")

if __name__ == '__main__':
    translate()
