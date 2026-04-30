import path from 'node:path';

const VI_PREFIX = 'vi';

const VIETNAMESE_CHAR_RE = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
const LATIN_RE = /[A-Za-z]/;
const SKIP_PROTOCOL_RE = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;
const ASSET_REF_RE = /^(?:\.\/)?(?:assets|dist|styles|js)\//i;
const HTML_FILE_RE = /\.html(?:[?#].*)?$/i;
const STATIC_ASSET_EXT_RE = /\.(?:avif|css|gif|jpe?g|js|json|mjs|mp4|png|svg|txt|webp|woff2?|ttf)(?:[?#].*)?$/i;

const EXACT_TEXT = new Map([
  ['About', 'Giới thiệu'],
  ['Research', 'Nghiên cứu'],
  ['Experience', 'Kinh nghiệm'],
  ['Credentials', 'Chứng chỉ'],
  ['Skills', 'Kỹ năng'],
  ['Education', 'Học vấn'],
  ['Contact', 'Liên hệ'],
  ['Work', 'Dự án'],
  ['Results', 'Kết quả'],
  ['Expertise', 'Chuyên môn'],
  ['Domains', 'Mảng nghiên cứu'],
  ['All work', 'Tất cả dự án'],
  ['Hospitality', 'Khách sạn và lưu trú'],
  ['Mobility', 'Giao thông'],
  ['Creators', 'Nhà sáng tạo nội dung'],
  ['Health', 'Sức khỏe'],
  ['Organizations', 'Tổ chức'],
  ['References', 'Tài liệu tham khảo'],
  ['Verified references', 'Tham chiếu xác thực'],
  ['Verified References', 'Tham chiếu xác thực'],
  ['Verified References | Profiles, Publications, and Project Records | Chung Hy Dai', 'Tham chiếu xác thực | Hồ sơ, công bố và hồ sơ dự án | Chung Hy Dai'],
  ["Public profiles, publication records, and portfolio routes that help verify Chung Hy Dai's work.", 'Hồ sơ công khai, hồ sơ công bố và tuyến portfolio giúp kiểm chứng công việc của Chung Hy Dai.'],
  ['Public signals behind the portfolio', 'Tín hiệu công khai phía sau portfolio'],
  ['Public profiles, publication records, and portfolio routes are collected here so reviewers can verify identity, project context, and supporting evidence from one clean page.', 'Các hồ sơ công khai, hồ sơ công bố và tuyến portfolio được gom tại đây để người xem kiểm chứng danh tính, bối cảnh dự án và bằng chứng hỗ trợ từ một trang gọn.'],
  ['Publication links', 'Liên kết công bố'],
  ['Identity context', 'Bối cảnh danh tính'],
  ['Chung Hy Dai / Dai Chung Hy: same portfolio owner, with family-name order reversed in some public records.', 'Chung Hy Dai / Dai Chung Hy: cùng một chủ portfolio, chỉ đảo thứ tự họ tên trong một số hồ sơ công khai.'],
  ['Evidence context', 'Bối cảnh bằng chứng'],
  ['Links point to external profiles, publication records, hosted PDFs, and the project pages that explain methods and results.', 'Các liên kết dẫn đến hồ sơ bên ngoài, hồ sơ công bố, PDF được lưu trên site và trang dự án giải thích phương pháp cùng kết quả.'],
  ['Review context', 'Bối cảnh xem xét'],
  ['Routes stay text-based and crawlable, with clear labels instead of image-only badges.', 'Các tuyến được giữ bằng chữ và có nhãn rõ thay vì chỉ dùng huy hiệu dạng ảnh.'],
  ['Primary public profiles.', 'Hồ sơ công khai chính.'],
  ['These links connect the portfolio to consistent public identity and work context.', 'Các liên kết này kết nối portfolio với danh tính công khai và bối cảnh công việc nhất quán.'],
  ['Profile links', 'Liên kết hồ sơ'],
  ['Public code profile connected to the portfolio repository.', 'Hồ sơ code công khai nối với repository portfolio.'],
  ['Professional profile with role context and contact route.', 'Hồ sơ nghề nghiệp có bối cảnh vai trò và kênh liên hệ.'],
  ['Persistent academic identifier for research continuity.', 'Mã định danh học thuật giúp duy trì mạch nghiên cứu.'],
  ['University article covering applied project work and recognition.', 'Bài viết của trường về dự án ứng dụng và ghi nhận.'],
  ['What these links clarify', 'Các liên kết này làm rõ điều gì'],
  ['Name alignment', 'Sự thống nhất về tên'],
  ['Primary and reversed-name records refer to the same portfolio owner.', 'Tên chính và tên đảo thứ tự đều chỉ cùng một chủ portfolio.'],
  ['Role alignment', 'Sự thống nhất về vai trò'],
  ['Public signals point to market research, customer understanding, and applied analytics.', 'Các tín hiệu công khai hướng đến nghiên cứu thị trường, hiểu khách hàng và phân tích ứng dụng.'],
  ['Trust signals', 'Tín hiệu tin cậy'],
  ['External links give context beyond self-published project pages.', 'Liên kết bên ngoài bổ sung bối cảnh ngoài các trang dự án tự xuất bản.'],
  ['Publication and project records.', 'Hồ sơ công bố và dự án.'],
  ['These routes connect selected portfolio work with external records or hosted source artifacts.', 'Các tuyến này nối một số dự án trong portfolio với hồ sơ bên ngoài hoặc tài liệu nguồn lưu trên site.'],
  ['External records', 'Hồ sơ bên ngoài'],
  ['Publication context for the virtual influencer trust study.', 'Bối cảnh công bố cho nghiên cứu niềm tin với nhân vật ảnh hưởng ảo.'],
  ['Conference context for the student nutrition research output.', 'Bối cảnh hội thảo cho kết quả nghiên cứu dinh dưỡng sinh viên.'],
  ['Institutional context connected to the Hanoi mobility policy study.', 'Bối cảnh tổ chức liên quan đến nghiên cứu chính sách giao thông Hà Nội.'],
  ['Hosted artifacts', 'Tài liệu lưu trên site'],
  ['Hosted artifact for the virtual influencer research page.', 'Tài liệu lưu trên site cho trang nghiên cứu nhân vật ảnh hưởng ảo.'],
  ['Hosted artifact for the student diet quality study.', 'Tài liệu lưu trên site cho nghiên cứu chất lượng ăn uống của sinh viên.'],
  ['Hosted visual artifact linked to creator-economy project work.', 'Tài liệu hình ảnh lưu trên site liên quan đến dự án kinh tế nhà sáng tạo nội dung.'],
  ['Core portfolio routes.', 'Các tuyến chính của portfolio.'],
  ['These routes keep education, projects, and honors easy to scan.', 'Các tuyến này giúp phần học vấn, dự án và giải thưởng dễ xem nhanh.'],
  ['Education context', 'Bối cảnh học vấn'],
  ['Education context covers the business and marketing training behind the project work.', 'Bối cảnh học vấn trình bày nền tảng kinh doanh và marketing phía sau các dự án.'],
  ['Projects archive lists the 11 applied projects by domain, method, and decision context.', 'Kho dự án liệt kê 11 dự án ứng dụng theo mảng, phương pháp và bối cảnh quyết định.'],
  ['Honors and Awards collects selected recognition and public signals.', 'Thành tích và giải thưởng tập hợp các ghi nhận và tín hiệu công khai nổi bật.'],
  ['Review public references.', 'Xem tham chiếu công khai.'],
  ['Use the profile links, project archive, or email route for specific project context.', 'Dùng liên kết hồ sơ, kho dự án hoặc email để hỏi bối cảnh cụ thể của dự án.'],
  ['Email Chung Hy Dai', 'Email Chung Hy Dai'],
  ['Insights', 'Ghi chú nghiên cứu'],
  ['Projects', 'Dự án'],
  ['Honors and Awards', 'Thành tích và giải thưởng'],
  ['Homepage', 'Trang chủ'],
  ['Home', 'Trang chủ'],
  ['About Chung Hy Dai', 'Giới thiệu Chung Hy Dai'],
  ['Projects archive', 'Kho dự án'],
  ['Projects Archive', 'Kho dự án'],
  ['Back to insights', 'Quay lại ghi chú nghiên cứu'],
  ['Back to All Research', 'Quay lại kho nghiên cứu'],
  ['Return to Research Hall', 'Quay lại khu nghiên cứu'],
  ['All Research', 'Tất cả nghiên cứu'],
  ['Selected Research', 'Nghiên cứu chọn lọc'],
  ['View selected work', 'Xem dự án chọn lọc'],
  ['View projects', 'Xem dự án'],
  ['Profile and methods', 'Hồ sơ và phương pháp'],
  ['Profile and method context', 'Bối cảnh hồ sơ và phương pháp'],
  ['Full Projects Archive', 'Kho dự án đầy đủ'],
  ['Research Notes', 'Ghi chú nghiên cứu'],
  ['Open archive', 'Mở kho nghiên cứu'],
  ['Open all projects', 'Mở tất cả dự án'],
  ['View featured work', 'Xem dự án nổi bật'],
  ['View all work', 'Xem tất cả dự án'],
  ['Open domain', 'Mở mảng này'],
  ['Back to portfolio', 'Quay lại portfolio'],
  ['5 domains', '5 mảng dự án'],
  ['Project domains', 'Mảng dự án'],
  ['Project domains.', 'Mảng dự án.'],
  ['Capabilities', 'Năng lực chính'],
  ['Featured work', 'Dự án nổi bật'],
  ['Selected projects', 'Dự án chọn lọc'],
  ['Impact snapshot', 'Tổng quan kết quả'],
  ['Recognition', 'Ghi nhận'],
  ['Publications', 'Công bố'],
  ['Education', 'Học vấn'],
  ['Core skills', 'Kỹ năng chính'],
  ['Send a message', 'Gửi email'],
  ['Need a specific project context?', 'Bạn cần bối cảnh cụ thể của dự án?'],
  ['Insight for the next decision.', 'Điểm tựa cho quyết định tiếp theo.'],
  ['Available for research, analytics, consulting, and project opportunities.', 'Sẵn sàng trao đổi về cơ hội nghiên cứu, phân tích, tư vấn và dự án.'],
  ['Use email for research, analytics, operations, or portfolio review questions.', 'Có thể liên hệ qua email cho câu hỏi về nghiên cứu, phân tích, vận hành hoặc portfolio.'],
  ['Market insight. Customer understanding. Business strategy.', 'Tín hiệu thị trường. Hiểu khách hàng. Chiến lược kinh doanh.'],
  ['Research. Insight. Business impact.', 'Nghiên cứu. Thấu hiểu. Tác động kinh doanh.'],
  ['Projects archive.', 'Kho dự án.'],
  ['11 projects', '11 dự án'],
  ['5 project domains', '5 mảng dự án'],
  ['3 projects', '3 dự án'],
  ['2 projects', '2 dự án'],
  ['EN/VI portfolio', 'Portfolio song ngữ'],
  ['Chung Hy Dai Insights', 'Ghi chú nghiên cứu của Chung Hy Dai'],
  ['Chung Hy Dai', 'Chung Hy Dai'],
  ['Market evidence, customer signals, clear choices, practical next steps.', 'Bằng chứng thị trường, tín hiệu khách hàng, lựa chọn rõ ràng và bước tiếp theo thực tế.'],
  ['Insight into strategy and', 'Từ insight đến chiến lược và'],
  ['smarter decisions.', 'quyết định sắc hơn.'],
  ['Insight into strategy and smarter decisions.', 'Từ insight đến chiến lược và quyết định sắc hơn.'],
  ['Eleven projects grouped by decision context, each with methods, visuals, and evidence notes.', '11 dự án được sắp theo bối cảnh quyết định, kèm phương pháp, hình ảnh và ghi chú bằng chứng.'],
  ['Customer and market evidence translated into clear recommendations, sharper reports, and decision-ready next steps.', 'Bằng chứng khách hàng và thị trường được chuyển thành khuyến nghị rõ, báo cáo gọn và bước tiếp theo sẵn sàng cho quyết định.'],
  ['Market research and consumer insights', 'Nghiên cứu thị trường và thấu hiểu người tiêu dùng'],
  ['11 applied projects across hospitality, mobility, creators, health, and organizations.', '11 dự án ứng dụng trong lưu trú, giao thông, nhà sáng tạo nội dung, sức khỏe và tổ chức.'],
  ['Research that moves from evidence to action.', 'Nghiên cứu đi từ bằng chứng đến hành động.'],
  ['A concise view of the portfolio.', 'Tổng quan ngắn gọn về portfolio.'],
  ['Business and marketing training with applied research practice.', 'Nền tảng kinh doanh và marketing, gắn với thực hành nghiên cứu ứng dụng.'],
  ['Bachelor of Business, Marketing major, Swinburne University of Technology. Project work spans market research, consumer insight, survey analysis, text analytics, and AI-supported exploration.', 'Bachelor of Business, chuyên ngành Marketing, Swinburne University of Technology. Dự án trải rộng qua nghiên cứu thị trường, insight người tiêu dùng, phân tích khảo sát, phân tích văn bản và khám phá dữ liệu có hỗ trợ AI.'],
  ['This portfolio is published under Chung Hy Dai and may also appear as Dai Chung Hy in reversed-name references.', 'Portfolio này dùng tên Chung Hy Dai và cũng có thể xuất hiện dưới dạng Dai Chung Hy trong một số tham chiếu đảo thứ tự tên.'],
  ['This portfolio is published under Chung Hy Dai. Some external records may use the reversed order Dai Chung Hy.', 'Portfolio này dùng tên Chung Hy Dai. Một số hồ sơ bên ngoài có thể dùng thứ tự đảo là Dai Chung Hy.'],
  ['External profile covering applied project work.', 'Bài profile bên ngoài về các dự án ứng dụng.'],
  ['Recognition and public signals.', 'Ghi nhận và tín hiệu công khai.'],
  ['Project archive', 'Kho dự án'],
  ['Browse work by domain, then open each case page for methods, evidence, and source notes.', 'Xem theo từng mảng, sau đó mở từng nghiên cứu để đọc phương pháp, bằng chứng và ghi chú nguồn.'],
  ['Browse work by domain, then open each case page for methods, visuals, and decision context.', 'Xem theo từng mảng, sau đó mở từng nghiên cứu để đọc phương pháp, hình ảnh và bối cảnh quyết định.'],
  ['Market research and applied analytics projects', 'Dự án nghiên cứu thị trường và phân tích ứng dụng'],
  ['Eleven projects across hospitality, EV choice, policy acceptance, creator behavior, nutrition, and organizational settings. Each card links to a case page with methods, visuals, and evidence notes.', '11 dự án về lưu trú, lựa chọn xe điện, mức chấp nhận chính sách, hành vi nhà sáng tạo nội dung, dinh dưỡng và bối cảnh tổ chức. Mỗi thẻ dẫn đến trang nghiên cứu có phương pháp, hình ảnh và ghi chú bằng chứng.'],
  ['Eleven projects across hospitality, EV choice, policy acceptance, creator behavior, nutrition, and organizational settings. Each card links to a case page with methods, visuals, and decision context.', '11 dự án về lưu trú, lựa chọn xe điện, mức chấp nhận chính sách, hành vi nhà sáng tạo nội dung, dinh dưỡng và bối cảnh tổ chức. Mỗi thẻ dẫn đến trang nghiên cứu có phương pháp, hình ảnh và bối cảnh quyết định.'],
  ['Start with the domain, then open the case.', 'Bắt đầu từ mảng nghiên cứu, sau đó mở từng nghiên cứu.'],
  ['Domain cards keep the archive simple. Case pages provide the detail when you need method, source, and proof of work.', 'Các thẻ mảng giúp kho dự án dễ đọc. Trang nghiên cứu cung cấp chi tiết khi cần phương pháp, nguồn và minh chứng công việc.'],
  ['Domain cards keep the archive simple. Case pages provide the detail when you need method, visuals, and decision context.', 'Các thẻ mảng giúp kho dự án dễ đọc. Trang nghiên cứu cung cấp chi tiết khi cần phương pháp, hình ảnh và bối cảnh quyết định.'],
  ['Browse by decision context.', 'Xem theo bối cảnh ra quyết định.'],
  ['Guest segments, service quality, and value priorities.', 'Phân khúc khách, chất lượng dịch vụ và ưu tiên giá trị.'],
  ['Consumer choice and public acceptance in transition contexts.', 'Lựa chọn người tiêu dùng và mức chấp nhận công chúng trong bối cảnh chuyển đổi.'],
  ['Engagement, trust, and retention in digital content contexts.', 'Mức gắn kết, niềm tin và khả năng quay lại trong bối cảnh nội dung số.'],
  ['Food choice, nutrition knowledge, and practical behavior design.', 'Lựa chọn thực phẩm, kiến thức dinh dưỡng và thiết kế hành vi thực tế.'],
  ['Participation, ownership, and co-created experience.', 'Mức tham gia, cảm giác sở hữu và trải nghiệm đồng tạo.'],
  ['Reported project', 'Dự án đã báo cáo'],
  ['Derived interpretation', 'Diễn giải ứng dụng'],
  ['Published output', 'Kết quả đã xuất bản'],
  ['Publication-linked', 'Có liên kết công bố'],
  ['Conceptual framework', 'Khung khái niệm'],
  ['Hospitality analytics', 'Phân tích lưu trú'],
  ['Mobility and policy', 'Giao thông và chính sách'],
  ['Creator economy', 'Kinh tế nhà sáng tạo nội dung'],
  ['Health behavior', 'Hành vi sức khỏe'],
  ['Organizational behavior', 'Hành vi tổ chức'],
  ['Hotel customer segmentation', 'Phân khúc khách hàng khách sạn'],
  ['Mapped 10 guest segments from 74,896 Booking.com reviews to guide targeting, positioning, and service priorities.', 'Phân thành 10 nhóm khách từ 74.896 đánh giá Booking.com để hỗ trợ chọn nhóm mục tiêu, định vị và ưu tiên dịch vụ.'],
  ['View project', 'Xem dự án'],
  ['Choice modeling', 'Mô hình lựa chọn'],
  ['EV consumer preference study', 'Nghiên cứu ưu tiên lựa chọn xe điện'],
  ['Explored how buyers trade off design, range, price, and charging access.', 'Phân tích cách người mua đánh đổi giữa thiết kế, quãng đường, giá và khả năng sạc.'],
  ['Mobility policy', 'Chính sách giao thông'],
  ['Motorbike phase-out acceptance', 'Mức chấp nhận lộ trình loại bỏ dần xe máy'],
  ['Framed public support around transit access, financial support, and rollout timing.', 'Đặt mức ủng hộ chính sách trong bối cảnh tiếp cận giao thông công cộng, hỗ trợ tài chính và thời điểm triển khai.'],
  ['Influencer retention research', 'Nghiên cứu khả năng giữ chân người theo dõi'],
  ['Linked content experience, engagement, brand transfer, and return intent.', 'Kết nối trải nghiệm nội dung, mức gắn kết, chuyển giao giá trị thương hiệu và ý định quay lại.'],
  ['Student diet quality in Vietnam', 'Chất lượng ăn uống của sinh viên tại Việt Nam'],
  ['Identified knowledge and activity factors linked to stronger diet-quality signals.', 'Xác định các yếu tố kiến thức và hoạt động liên quan đến tín hiệu chất lượng ăn uống tốt hơn.'],
  ['Market insight', 'Tín hiệu thị trường'],
  ['Clarify what is changing across markets, categories, and customer groups.', 'Làm rõ điều gì đang thay đổi trong thị trường, ngành hàng và nhóm khách hàng.'],
  ['Customer understanding', 'Hiểu khách hàng'],
  ['Use surveys, reviews, and interviews to understand how people choose.', 'Dùng khảo sát, đánh giá và phỏng vấn để hiểu cách người dùng lựa chọn.'],
  ['Strategy and translation', 'Chiến lược và diễn giải'],
  ['Turn analysis into short reports, visuals, and practical recommendations.', 'Chuyển phân tích thành báo cáo ngắn, hình ảnh rõ ràng và khuyến nghị thực tế.'],
  ['Decision support', 'Hỗ trợ quyết định'],
  ['Help teams compare options and decide with more confidence.', 'Giúp đội ngũ so sánh lựa chọn và ra quyết định tự tin hơn.'],
  ['Applied research projects', 'Dự án nghiên cứu ứng dụng'],
  ['Publication-linked outputs', 'Kết quả có liên kết công bố'],
  ['Years of project activity', 'Năm hoạt động dự án'],
  ['Hotel reviews analyzed', 'Đánh giá khách sạn đã phân tích'],
  ['Research domains', 'Mảng nghiên cứu'],
  ['Swinburne Vietnam News feature', 'Bài viết từ Swinburne Vietnam News'],
  ['Read source article', 'Đọc bài nguồn'],
  ['View publication context', 'Xem bối cảnh công bố'],
  ['Swinburne feature', 'Bài Swinburne'],
  ['HSBC Business Case 2024', 'HSBC Business Case 2024'],
  ['Advanced to the Champion Round and presented recommendations under time pressure.', 'Vào vòng Champion Round và trình bày khuyến nghị trong thời gian giới hạn.'],
  ['Swinburne academic scholarship', 'Học bổng học thuật Swinburne'],
  ['Merit-based award for the Bachelor of Business program.', 'Học bổng dựa trên thành tích cho chương trình Bachelor of Business.'],
  ['Aspiring Star research prize', 'Giải thưởng nghiên cứu Aspiring Star'],
  ['Recognized by Greenovation for research activity and commitment to inquiry.', 'Được Greenovation ghi nhận cho hoạt động nghiên cứu và tinh thần tìm hiểu.'],
  ['FCBEM 2025 and Springer-linked virtual influencer chapter context.', 'Bối cảnh FCBEM 2025 và chương sách về nhân vật ảnh hưởng ảo có liên kết Springer.'],
  ['Bachelor of Business, Marketing major, Swinburne University of Technology.', 'Bachelor of Business, chuyên ngành Marketing, Swinburne University of Technology.'],
  ['Profile and methodology', 'Hồ sơ và phương pháp'],
  ['Survey design, text analysis, segmentation, reporting, and decision notes.', 'Thiết kế khảo sát, phân tích văn bản, phân khúc, báo cáo và ghi chú quyết định.'],
  ['See work examples', 'Xem ví dụ dự án'],
  ['Hotel customer segmentation from aspect-level sentiment', 'Phân khúc khách hàng khách sạn từ aspect-level sentiment'],
  ['Maps 10 guest segments from 74,896 Booking.com reviews in Da Nang.', 'Phân thành 10 nhóm khách từ 74.896 đánh giá Booking.com tại Đà Nẵng.'],
  ['ABSA - K-means - GMM robustness', 'ABSA - K-means - kiểm tra GMM'],
  ['Hotel attribute asymmetry in Vietnam', 'Bất đối xứng thuộc tính khách sạn tại Việt Nam'],
  ['Shows which hotel attributes create the largest rating penalties when they fail.', 'Cho thấy thuộc tính khách sạn nào tạo mức giảm điểm lớn nhất khi không đáp ứng tốt.'],
  ['Sentence-BERT - PRCA - Kano', 'Sentence-BERT - PRCA - Kano'],
  ['Turns review text signals into functional, emotional, and social value actions.', 'Chuyển tín hiệu từ đánh giá thành hành động theo giá trị chức năng, cảm xúc và xã hội.'],
  ['Value mapping - decision translation', 'Bản đồ giá trị - chuyển dịch thành quyết định'],
  ['EV design vs. range trade-offs in Vietnam', 'Đánh đổi giữa thiết kế và quãng đường EV tại Việt Nam'],
  ['Tests how young consumers trade off design, range, price, and charging.', 'Kiểm tra cách người tiêu dùng trẻ đánh đổi giữa thiết kế, quãng đường, giá và khả năng sạc.'],
  ['Choice profiles - attribute trade-offs', 'Hồ sơ lựa chọn - đánh đổi thuộc tính'],
  ['Hanoi motorbike phase-out policy acceptance', 'Mức chấp nhận chính sách loại bỏ dần xe máy tại Hà Nội'],
  ['Frames acceptance around support-first sequencing before broad restrictions.', 'Diễn giải mức chấp nhận theo hướng hỗ trợ trước, hạn chế rộng sau.'],
  ['Discrete choice - policy sequencing', 'Lựa chọn rời rạc - trình tự chính sách'],
  ['Influencer retention, engagement, and brand transfer', 'Khả năng quay lại, mức gắn kết và chuyển giao giá trị thương hiệu của người ảnh hưởng'],
  ['Links experience quality, engagement, brand equity, and return intent.', 'Kết nối chất lượng trải nghiệm, mức gắn kết, giá trị thương hiệu và ý định quay lại.'],
  ['SEM - UGC retention strategy', 'SEM - chiến lược giữ chân trên nền tảng UGC'],
  ['Virtual influencer cues, Gen Z trust, and purchase intention', 'Tín hiệu nhân vật ảnh hưởng ảo, niềm tin Gen Z và ý định mua'],
  ['Examines credibility cues and trust response to virtual personas.', 'Xem xét tín hiệu độ tin cậy và phản ứng niềm tin với nhân vật ảo.'],
  ['Survey - trust modeling - DOI context', 'Khảo sát - mô hình niềm tin - bối cảnh DOI'],
  ['Buffet menu nudging and choice architecture', 'Gợi ý thứ tự thực đơn buffet và kiến trúc lựa chọn'],
  ['Tests whether healthier-first menu order shifts intake and tier choice.', 'Kiểm tra liệu thứ tự menu ưu tiên món lành mạnh có thay đổi lượng ăn dự kiến và lựa chọn gói hay không.'],
  ['Experiment design - ANOVA', 'Thiết kế thử nghiệm - ANOVA'],
  ['Nutrition knowledge, physical activity, and diet quality', 'Kiến thức dinh dưỡng, hoạt động thể chất và chất lượng ăn uống'],
  ['Connects student knowledge, routines, and diet-quality signals.', 'Kết nối kiến thức, thói quen và tín hiệu diet quality của sinh viên.'],
  ['Regression - survey methodology', 'Hồi quy - phương pháp khảo sát'],
  ['Psychological ownership in Vietnam universities', 'Cảm giác sở hữu trong đại học Việt Nam'],
  ['Turns ownership theory into practical commitment actions.', 'Chuyển lý thuyết sở hữu tâm lý thành hành động tăng cam kết.'],
  ['Framework design - organizational engagement', 'Thiết kế khung phân tích - gắn kết tổ chức'],
  ['Arts workshop co-creation and customer interest', 'Đồng tạo trong workshop nghệ thuật và mức quan tâm của khách hàng'],
  ['Shows how learning, social, and emotional value shape repeat interest.', 'Cho thấy giá trị học tập, xã hội và cảm xúc định hình repeat interest.'],
  ['Service design - value co-creation', 'Thiết kế dịch vụ - đồng tạo giá trị'],
  ['Research Work', 'Dự án nghiên cứu'],
  ['All applied research projects.', 'Toàn bộ dự án nghiên cứu ứng dụng.'],
  ['Applied Research Projects', 'Dự án nghiên cứu ứng dụng'],
  ['Selected research evidence.', 'Một số bằng chứng nghiên cứu nổi bật.'],
  ['Evidence Summary', 'Tóm tắt bằng chứng'],
  ['Work Signals', 'Tín hiệu năng lực'],
  ['How the work is reviewed.', 'Cách đọc và kiểm chứng năng lực.'],
  ['Work Modes', 'Cách làm việc'],
  ['Market Research · Reporting · AI-assisted Analysis', 'Nghiên cứu thị trường · Báo cáo insight · Phân tích hỗ trợ bởi AI'],
  ['Market research, reporting, and AI-supported insights', 'Nghiên cứu thị trường, báo cáo insight và phân tích hỗ trợ bởi AI'],
  ['Insight reporting', 'Báo cáo insight'],
  ['AI-assisted analysis', 'Phân tích có hỗ trợ AI'],
  ['Survey & text data', 'Dữ liệu khảo sát và văn bản'],
  ['Executive summaries', 'Tóm tắt điều hành'],
  ['Years of applied work', 'Năm làm dự án ứng dụng'],
  ['Research and analytics projects', 'Dự án nghiên cứu và phân tích'],
  ['AI workflow', 'Quy trình AI'],
  ['Reporting', 'Báo cáo'],
  ['Analytics', 'Phân tích'],
  ['Review path', 'Tuyến đọc hồ sơ'],
  ['Selected Work Archive', 'Kho dự án chọn lọc'],
  ['Choice Modeling Case', 'Nghiên cứu mô hình lựa chọn'],
  ['Policy Acceptance Case', 'Nghiên cứu mức chấp nhận chính sách'],
  ['Market Research and Applied Analytics Projects', 'Dự án nghiên cứu thị trường và phân tích ứng dụng'],
  ['Market Research & Applied Analytics Projects', 'Dự án nghiên cứu thị trường và phân tích ứng dụng'],
  ['Evidence labels:', 'Nhãn bằng chứng:'],
  ['These labels show how directly each claim is supported.', 'Các nhãn này cho biết mỗi nhận định được hỗ trợ trực tiếp đến mức nào.'],
  ['Primary portfolio deep links highlighted on the homepage.', 'Các liên kết chính được ưu tiên trên trang chủ portfolio.'],
  ['Market research and consumer insights analyst.', 'Chuyên viên phân tích nghiên cứu thị trường và thấu hiểu người tiêu dùng.'],
  ['Market Research and Consumer Insights Analyst', 'Chuyên viên phân tích nghiên cứu thị trường và thấu hiểu người tiêu dùng'],
  ['Market Research & Consumer Insights Analyst.', 'Chuyên viên phân tích nghiên cứu thị trường và thấu hiểu người tiêu dùng.'],
  ['Market Research & Consumer Insights', 'Nghiên cứu thị trường và thấu hiểu người tiêu dùng'],
  ['Market research. Consumer evidence. Decision support.', 'Nghiên cứu thị trường. Bằng chứng người tiêu dùng. Hỗ trợ quyết định.'],
  ['Evidence for', 'Bằng chứng cho'],
  ['clearer decisions.', 'quyết định rõ hơn.'],
  ['Survey responses, review data, choice experiments, and clear reporting turned into segmentation, product, policy, and service recommendations for teams that need evidence before decisions.', 'Dữ liệu khảo sát, review, choice experiment và báo cáo rõ ràng được chuyển thành khuyến nghị về phân khúc, sản phẩm, chính sách và dịch vụ cho các nhóm cần bằng chứng trước khi ra quyết định.'],
  ['Skills tied to proof', 'Kỹ năng gắn với bằng chứng'],
  ['Methods shown in case pages, not just listed as keywords.', 'Phương pháp được thể hiện trong case page, không chỉ liệt kê như keyword.'],
  ['Start here', 'Bắt đầu ở đây'],
  ['Three fastest proof points.', 'Ba bằng chứng nên xem trước.'],
  ['Problem / method / result', 'Vấn đề / phương pháp / kết quả'],
  ['1-minute read', 'Đọc trong 1 phút'],
  ['What a reviewer should take away first.', 'Điều người xem nên nắm trước.'],
  ['Main finding', 'Kết quả chính'],
  ['Consumer Insights', 'Thấu hiểu người tiêu dùng'],
  ['Applied analytics', 'Phân tích ứng dụng'],
  ['Market Research', 'Nghiên cứu thị trường'],
  ['Years of project activity', 'Năm hoạt động dự án'],
  ['Projects', 'Dự án'],
  ['Publications', 'Công bố'],
  ['Profile', 'Hồ sơ'],
  ['Focus Areas', 'Mảng trọng tâm'],
  ['Signals', 'Tín hiệu xác thực'],
  ['Verified Signals', 'Tín hiệu xác thực'],
  ['Verified Signals and References', 'Tín hiệu hồ sơ và chứng chỉ'],
  ['Short Research Insights', 'Ghi chú nghiên cứu ngắn'],
  ['Research Insights', 'Ghi chú nghiên cứu'],
  ['What this page covers', 'Nội dung chính'],
  ['Quick reading path', 'Tuyến đọc nhanh'],
  ['Applied interpretation', 'Diễn giải ứng dụng'],
  ['Full context nearby', 'Bối cảnh đầy đủ ở gần'],
  ['Gen Z', 'Gen Z'],
  ['Trust cues', 'Tín hiệu niềm tin'],
  ['Connection', 'Kết nối'],
  ['How the insights connect to the portfolio.', 'Các ghi chú nghiên cứu liên kết với portfolio như thế nào.'],
  ['Each insight points back to a main study', 'Mỗi ghi chú nối về nghiên cứu chính'],
  ['Each insight keeps the evidence close', 'Mỗi ghi chú giữ bằng chứng ở gần'],
  ['Links to the full case pages and topic clusters stay visible for review.', 'Liên kết đến trang nghiên cứu đầy đủ và cụm chủ đề vẫn hiển thị để tiện xem xét.'],
  ['Deep Links', 'Liên kết sâu'],
  ['Main case study routes', 'Tuyến nghiên cứu chính'],
  ['Main case-study routes', 'Tuyến nghiên cứu chính'],
  ['Topic-cluster routes', 'Tuyến cụm chủ đề'],
  ['EV choice experiment in Vietnam', 'Thử nghiệm lựa chọn xe điện tại Việt Nam'],
  ['Full case-study page with the experiment framing, segments, and trade-off interpretation.', 'Trang nghiên cứu đầy đủ với khung thử nghiệm, phân khúc và diễn giải đánh đổi.'],
  ['Full study page behind the student diet quality insight.', 'Trang nghiên cứu đầy đủ phía sau ghi chú về chất lượng ăn uống của sinh viên.'],
  ['Use these pages as quick entry points, then open the full case pages for methods and evidence.', 'Dùng các trang này để đọc nhanh, sau đó mở trang nghiên cứu đầy đủ để xem phương pháp và bằng chứng.'],
  ['Each insight sits inside a topic cluster', 'Mỗi ghi chú nằm trong một cụm chủ đề'],
  ['The EV, diet quality, and virtual influencer pages link back to their related topic hubs.', 'Các trang xe điện, chất lượng ăn uống và nhân vật ảnh hưởng ảo đều liên kết về cụm chủ đề liên quan.'],
  ['Virtual influencer cues, Gen Z trust, and purchase intention', 'Tín hiệu nhân vật ảnh hưởng ảo, niềm tin Gen Z và ý định mua'],
  ['Full research page connected to the trust insight and publication record.', 'Trang nghiên cứu đầy đủ nối với ghi chú về niềm tin và hồ sơ công bố.'],
  ['Mobility and policy research', 'Nghiên cứu giao thông và chính sách'],
  ['Cluster page for EV choice and Hanoi transition policy work.', 'Trang cụm cho lựa chọn xe điện và nghiên cứu chính sách chuyển đổi tại Hà Nội.'],
  ['Health and behavior research', 'Nghiên cứu sức khỏe và hành vi'],
  ['Cluster page for diet quality and buffet nudging research.', 'Trang cụm cho nghiên cứu chất lượng ăn uống và sắp xếp thực đơn buffet.'],
  ['Creator economy research', 'Nghiên cứu kinh tế nhà sáng tạo nội dung'],
  ['Cluster page for influencer strategy and virtual influencer trust.', 'Trang cụm cho chiến lược người ảnh hưởng và niềm tin với nhân vật ảnh hưởng ảo.'],
  ['Research domains and case clusters.', 'Các mảng nghiên cứu và cụm dự án.'],
  ['Research Domains', 'Mảng nghiên cứu'],
  ['Archive Map', 'Bản đồ kho nghiên cứu'],
  ['Browse by research domain.', 'Xem theo mảng nghiên cứu.'],
  ['See the evidence approach and profile context behind these pages.', 'Xem cách tiếp cận bằng chứng và bối cảnh hồ sơ phía sau các trang này.'],
  ['See the profile context and evidence approach behind these pages.', 'Xem bối cảnh hồ sơ và cách tiếp cận bằng chứng phía sau các trang này.'],
  ['See how the profile context and evidence labels fit together.', 'Xem bối cảnh hồ sơ và nhãn bằng chứng được liên kết như thế nào.'],
  ['Research scope', 'Phạm vi nghiên cứu'],
  ['Typical questions', 'Câu hỏi thường gặp'],
  ['Common methods', 'Phương pháp thường dùng'],
  ['Decision value', 'Giá trị cho quyết định'],
  ['Analytical focus', 'Trọng tâm phân tích'],
  ['Projects', 'Dự án'],
  ['Related Research', 'Nghiên cứu liên quan'],
  ['Site Routes', 'Điều hướng site'],
  ['Browse the main portfolio paths', 'Xem các tuyến chính của portfolio'],
  ['Explore adjacent research paths', 'Xem các hướng nghiên cứu liên quan'],
  ['Official Club Page', 'Trang chính thức của câu lạc bộ'],
  ['View SUS activity feed', 'Xem activity feed của SUS'],
  ['Community Activity', 'Hoạt động cộng đồng'],
  ['On-site volunteer team coordination', 'Điều phối đội volunteer tại sự kiện'],
  ['Academic Background.', 'Học vấn.'],
  ['Graduated', 'Đã tốt nghiệp'],
  ['External evidence', 'Bằng chứng ngoài'],
  ['Research notes', 'Ghi chú nghiên cứu'],
  ['Research insights', 'Ghi chú nghiên cứu'],
  ['Study interpretation', 'Diễn giải nghiên cứu'],
  ['Selected Work', 'Dự án chọn lọc'],
  ['Purpose of this note', 'Nội dung chính'],
  ['What this insight covers', 'Insight này nói về gì'],
  ['Main route', 'Tuyến chính'],
  ['Cluster route', 'Cụm liên quan'],
  ['Key Takeaways', 'Điểm chính'],
  ['Decision Use', 'Cách dùng cho quyết định'],
  ['Focus area', 'Mảng trọng tâm'],
  ['Last updated 21 Apr 2026', 'Cập nhật ngày 21/04/2026'],
  ['Last updated 22 Apr 2026', 'Cập nhật ngày 22/04/2026'],
  ['Last updated 25 Apr 2026', 'Cập nhật ngày 25/04/2026'],
  ['Published 22 Apr 2026', 'Đăng ngày 22/04/2026'],
  ['Email Chung Hy Dai', 'Email Chung Hy Dai'],
  ['Contact Chung Hy Dai', 'Liên hệ Chung Hy Dai'],
  ['Review Credentials', 'Xem chứng chỉ'],
  ['Review creator projects', 'Xem các dự án về nhà sáng tạo nội dung'],
  ['Review health projects', 'Xem các dự án sức khỏe'],
  ['Review hospitality projects', 'Xem các dự án khách sạn và lưu trú'],
  ['Review mobility projects', 'Xem các dự án giao thông'],
  ['Review organizational projects', 'Xem các dự án tổ chức'],
  ['Review Simulation Roles', 'Xem vai trò mô phỏng'],
  ['View Key Results', 'Xem kết quả chính'],
  ['Page Not Found | Chung Hy Dai', 'Không tìm thấy trang | Chung Hy Dai'],
  ['This page is not available.', 'Trang này hiện không khả dụng.'],
  ['This study has moved.', 'Nghiên cứu này đã được chuyển sang trang mới.'],
  ['Open Canonical Page', 'Mở trang chính thức'],
  ['Legacy Route', 'Đường dẫn cũ'],
  ['Profiles', 'Hồ sơ'],
  ['Primary profile links', 'Liên kết hồ sơ chính'],
  ['Public profiles', 'Hồ sơ công khai'],
  ['External conference and publication records', 'Hồ sơ hội thảo và công bố bên ngoài'],
  ['Springer chapter record', 'Hồ sơ chương sách trên Springer'],
  ['Virtual influencer chapter record with DOI-backed publication context.', 'Hồ sơ chương sách về nhân vật ảnh hưởng ảo với bối cảnh công bố có DOI.'],
  ['FCBEM 2025 conference page', 'Trang hội thảo FCBEM 2025'],
  ['Conference page connected to the nutrition research output referenced in the portfolio.', 'Trang hội thảo liên kết với kết quả nghiên cứu dinh dưỡng được nêu trong portfolio.'],
  ['Hanoi mobility policy case', 'Case chính sách giao thông Hà Nội'],
  ['Portfolio case page used while the external CIEMB domain is unavailable.', 'Trang case trên portfolio được dùng khi domain CIEMB bên ngoài chưa truy cập được.'],
  ['Public PDF artifacts hosted on the site', 'Các tệp PDF công khai được lưu trên site'],
  ['Virtual Influencer PDF', 'PDF Virtual Influencer'],
  ['Portfolio-hosted PDF artifact connected to the virtual influencer research page.', 'Tệp PDF lưu trên portfolio, liên kết với trang nghiên cứu nhân vật ảnh hưởng ảo.'],
  ['Nutrition PDF', 'PDF Nutrition'],
  ['Portfolio-hosted PDF artifact connected to the student diet quality study.', 'Tệp PDF lưu trên portfolio, liên kết với nghiên cứu chất lượng ăn uống của sinh viên.'],
  ['EEEU infographic PDF', 'PDF infographic EEEU'],
  ['Public conference-facing visual linked to the creator-economy research thread.', 'Hình ảnh công khai cho hội thảo, liên kết với mạch nghiên cứu kinh tế nhà sáng tạo nội dung.'],
  ['GitHub profile', 'Hồ sơ GitHub'],
  ['LinkedIn profile', 'Hồ sơ LinkedIn'],
  ['ORCID record', 'Hồ sơ ORCID'],
  ['Swinburne Vietnam News feature', 'Bài viết từ Swinburne Vietnam News'],
  ['Swinburne Vietnam feature', 'Bài viết Swinburne Vietnam'],
  ['Swinburne Vietnam profile feature', 'Bài profile trên Swinburne Vietnam'],
  ['Read source article', 'Đọc bài nguồn'],
  ['Hospitality Analytics Research', 'Nghiên cứu phân tích lưu trú'],
  ['Mobility and Policy Research', 'Nghiên cứu giao thông và chính sách'],
  ['Creator Economy Research', 'Nghiên cứu kinh tế nhà sáng tạo nội dung'],
  ['Health and Behavior Research', 'Nghiên cứu sức khỏe và hành vi'],
  ['Organizational Behavior Research', 'Nghiên cứu hành vi tổ chức'],
  ['EV Choice Experiment in Vietnam', 'Thử nghiệm lựa chọn xe điện tại Việt Nam'],
  ['Student Diet Quality in Vietnam', 'Chất lượng ăn uống của sinh viên tại Việt Nam'],
  ['Virtual Influencer Trust', 'Niềm tin với nhân vật ảnh hưởng ảo'],
  ['Virtual Influencer Trust and Purchase Intention', 'Niềm tin với nhân vật ảnh hưởng ảo và ý định mua'],
  ['Hotel Attribute Asymmetry in Vietnam', 'Bất đối xứng thuộc tính khách sạn tại Việt Nam'],
  ['Hotel Value Segmentation Framework', 'Khung phân khúc giá trị khách sạn'],
  ['Hotel Customer Segmentation from Aspect-Level Sentiment', 'Phân khúc khách hàng khách sạn từ phân tích cảm xúc theo khía cạnh'],
  ['Hotel Customer Segmentation from Aspect-Level Sentiment in Da Nang', 'Phân khúc khách hàng khách sạn tại Đà Nẵng từ phân tích cảm xúc theo khía cạnh'],
  ['Hanoi Motorbike Phase-Out Policy Acceptance', 'Mức chấp nhận chính sách loại bỏ dần xe máy tại Hà Nội'],
  ['Hotel Attribute Asymmetry in Vietnam (PRCA + Kano)', 'Bất đối xứng thuộc tính khách sạn tại Việt Nam (PRCA + Kano)'],
  ['Buffet Menu Nudging and Choice Architecture', 'Sắp xếp thực đơn buffet và kiến trúc lựa chọn'],
  ['Psychological Ownership in Vietnam Universities', 'Cảm giác sở hữu trong các đại học tại Việt Nam'],
  ['Arts Workshop Co-creation and Customer Interest', 'Đồng tạo trong workshop nghệ thuật và mức quan tâm của khách hàng'],
  ['Influencer Retention, Engagement, and Brand Transfer on UGC Platforms', 'Khả năng quay lại, mức gắn kết và chuyển giao giá trị thương hiệu trên nền tảng UGC'],
  ['The Core Challenge', 'Vấn đề cốt lõi'],
  ['The Problem', 'Vấn đề'],
  ['The Method', 'Phương pháp'],
  ['The Result', 'Kết quả'],
  ['Visual Evidence', 'Bằng chứng trực quan'],
  ['Visual Evidence & Test Environment', 'Bằng chứng trực quan và môi trường kiểm thử'],
  ['Diagnostics Summary', 'Tóm tắt chẩn đoán'],
  ['Related Research', 'Nghiên cứu liên quan'],
  ['Browse the Hospitality Analytics Research topic page', 'Xem trang chủ đề nghiên cứu phân tích lưu trú'],
  ['Weekly Review Volume by Source Market', 'Lượng review theo nguồn thị trường qua từng tuần'],
  ['Tracking review submissions across different traveler origins over time.', 'Theo dõi lượng review theo nhóm khách đến từ các thị trường khác nhau theo thời gian.'],
  ['The review text formed distinguishable clusters, including groups such as "Minimalists" and "Experience Seekers".', 'Dữ liệu review tạo thành các cụm khác biệt rõ, gồm những nhóm như "Minimalists" và "Experience Seekers".'],
  ['The text data formed distinguishable clusters, including groups such as "Minimalists" and "Experience Seekers".', 'Dữ liệu văn bản tạo thành các cụm khác biệt rõ, gồm những nhóm như "Minimalists" và "Experience Seekers".'],
  ['Aspects like "Staff" and "Location" drove universal satisfaction, while "Value" and "Comfort" were key differentiators for unhappy clusters.', 'Các khía cạnh như "Staff" và "Location" tạo mức hài lòng rộng khắp, trong khi "Value" và "Comfort" là điểm tách biệt chính ở các nhóm kém hài lòng.'],
  ['Conclusion:', 'Kết luận:'],
  ['Visualizing how Speciesism acts as a ceiling to influencer effectiveness.', 'Minh họa cách speciesism hoạt động như một trần giới hạn hiệu quả của nhân vật ảnh hưởng.'],
  ['Read Book Chapter PDF', 'Đọc chương sách dạng PDF'],
  ['Health Behavior • Consumer Insights • Statistical Modeling', 'Sức khỏe và hành vi • Thấu hiểu người tiêu dùng • Mô hình thống kê'],
  ['280 Students', '280 sinh viên'],
  ['Background', 'Bối cảnh'],
  ['Method', 'Phương pháp'],
  ['Results', 'Kết quả'],
  ['References', 'Tham chiếu'],
  ['Problem Framing', 'Khung vấn đề'],
  ['Background and Gap', 'Bối cảnh và khoảng trống'],
  ['Samples', 'Mẫu'],
  ['Sample', 'Mẫu'],
  ['Source', 'Nguồn'],
  ['Period', 'Giai đoạn'],
  ['Model', 'Mô hình'],
  ['Context', 'Bối cảnh'],
  ['Dataset', 'Dữ liệu'],
  ['Methods', 'Phương pháp'],
  ['Authors:', 'Tác giả:'],
  ['Focus Lens', 'Góc nhìn chính'],
  ['Evidence Tier', 'Mức bằng chứng'],
  ['Data Status', 'Trạng thái dữ liệu'],
  ['Use Case', 'Tình huống sử dụng'],
  ['Positioning', 'Định vị'],
  ['Framework Visualization', 'Minh họa khung phân tích'],
  ['Related Study', 'Nghiên cứu liên quan'],
  ['Why This Exists', 'Vì sao cần trang này'],
  ['Verified Output:', 'Kết quả đã xác thực:'],
  ['Simulation Blocks & Findings', 'Các khối mô phỏng và phát hiện'],
  ['Purchase Intention by Scenario & Speciesism', 'Ý định mua theo kịch bản và speciesism'],
  ['Trust modeling', 'Mô hình hóa niềm tin'],
  ['Discrete choice', 'Lựa chọn rời rạc'],
  ['Choice modeling', 'Mô hình lựa chọn'],
  ['Regression Analysis', 'Phân tích hồi quy'],
  ['ANOVA Testing', 'Kiểm định ANOVA'],
  ['Choice Experiment', 'Thử nghiệm lựa chọn'],
  ['Clustering & Sentiment Setup', 'Thiết lập phân cụm và cảm xúc'],
  ['Springer Publishing published', 'Đã xuất bản bởi Springer'],
  ['Simulated Environments', 'Môi trường mô phỏng'],
  ['Ho Chi Minh City, Vietnam', 'TP. Hồ Chí Minh, Việt Nam'],
  ['Da Nang, Vietnam', 'Đà Nẵng, Việt Nam'],
  ['Hanoi & HCMC, Vietnam', 'Hà Nội và TP. Hồ Chí Minh, Việt Nam']
]);

const VI_COPY_TRANSLATIONS = [
  [
    'Market Research and Consumer Insights Analyst',
    'Chuyên viên phân tích nghiên cứu thị trường và thấu hiểu người tiêu dùng'
  ],
  [
    'Market Research & Consumer Insights Analyst',
    'Chuyên viên phân tích nghiên cứu thị trường và thấu hiểu người tiêu dùng'
  ],
  [
    'Market Research &amp; Consumer Insights',
    'Nghiên cứu thị trường và thấu hiểu người tiêu dùng'
  ],
  [
    'Market Research & Applied Analytics Projects',
    'Dự án nghiên cứu thị trường và phân tích ứng dụng'
  ],
  [
    'Chung Hy Dai | Market Research and Consumer Insights Analyst',
    'Chung Hy Dai | Chuyên viên phân tích nghiên cứu thị trường và thấu hiểu người tiêu dùng'
  ],
  [
    'Chung Hy Dai | Market Research & Consumer Insights Analyst',
    'Chung Hy Dai | Chuyên viên phân tích nghiên cứu thị trường và thấu hiểu người tiêu dùng'
  ],
  [
    'Chung Hy Dai | Market Research &amp; Applied Analytics Projects',
    'Chung Hy Dai | Dự án nghiên cứu thị trường và phân tích ứng dụng'
  ],
  [
    'Chung Hy Dai | Market Research & Applied Analytics Projects',
    'Chung Hy Dai | Dự án nghiên cứu thị trường và phân tích ứng dụng'
  ],
  [
    'Portfolio of Chung Hy Dai, a market research and consumer insights analyst focused on applied analytics, hospitality segmentation, EV choice, service quality, creator economy, and behavior research in Vietnam.',
    'Portfolio của Chung Hy Dai, tập trung vào market research, consumer insights, phân tích ứng dụng, hospitality segmentation, EV choice, service quality, creator economy và nghiên cứu hành vi tại Việt Nam.'
  ],
  [
    'Portfolio of Chung Hy Dai, a market research and consumer insights analyst focused on market research, insight reporting, AI-assisted analysis, applied analytics, and decision-ready business evidence.',
    'Portfolio của Chung Hy Dai, tập trung vào market research, insight reporting, phân tích có hỗ trợ AI, applied analytics và bằng chứng kinh doanh đủ rõ để hỗ trợ quyết định.'
  ],
  [
    'Portfolio of Chung Hy Dai, a market research and consumer insights analyst focused on market research, insight reporting, AI-assisted analysis, and applied analytics for business decisions.',
    'Portfolio của Chung Hy Dai, tập trung vào market research, insight reporting, phân tích có hỗ trợ AI và applied analytics cho quyết định kinh doanh.'
  ],
  [
    'Portfolio of Chung Hy Dai, a market research and consumer insights analyst focused on applied analytics, hospitality segmentation, EV choice, service quality, creator economy, and behavior.',
    'Portfolio của Chung Hy Dai, tập trung vào market research, consumer insights, phân tích ứng dụng, hospitality segmentation, EV choice, service quality, creator economy và nghiên cứu hành vi.'
  ],
  [
    'Portfolio of Chung Hy Dai featuring market research, consumer insights, hospitality segmentation, EV choice, policy acceptance, and applied analytics across service and behavior.',
    'Portfolio của Chung Hy Dai giới thiệu các dự án market research, consumer insights, hospitality segmentation, EV choice, policy acceptance và applied analytics trong mảng dịch vụ và hành vi.'
  ],
  [
    'Chung Hy Dai Market Research and Consumer Insights Analyst',
    'Chung Hy Dai - Chuyên viên phân tích nghiên cứu thị trường và thấu hiểu người tiêu dùng'
  ],
  [
    'This portfolio presents applied work in market research, consumer insights, hospitality segmentation, EV choice, policy acceptance, and creator-economy research in Vietnam.',
    'Portfolio này trình bày các dự án ứng dụng về market research, consumer insights, hospitality segmentation, EV choice, policy acceptance và creator economy tại Việt Nam.'
  ],
  [
    'Customer, market, and project data become clear research reports, insight summaries, and decision-ready outputs. The case pages show the methods and evidence behind that work.',
    'Dữ liệu khách hàng, thị trường và dự án được chuyển thành báo cáo nghiên cứu, tóm tắt insight và đầu ra sẵn sàng cho quyết định. Các trang case cho thấy phương pháp và bằng chứng phía sau từng kết quả.'
  ],
  [
    'Business graduate from Swinburne University with 11 applied projects across hospitality segmentation, EV choice, motorbike policy, UGC retention, service quality, and consumer behavior. The work uses research, analytics, and clear reporting to support problem definition and decision-making.',
    'Tốt nghiệp ngành Kinh doanh tại Swinburne University, với 11 dự án ứng dụng về phân khúc lưu trú, lựa chọn xe điện, chính sách xe máy, khả năng giữ chân trên nền tảng nội dung, chất lượng dịch vụ và hành vi người tiêu dùng. Các dự án dùng nghiên cứu, phân tích và báo cáo rõ ràng để hỗ trợ định nghĩa vấn đề và ra quyết định.'
  ],
  [
    'Business graduate from Swinburne University with 11 applied projects in market research, consumer insights, survey analysis, text analytics, reporting, and AI-assisted exploration. The work focuses on framing useful questions, building evidence, and translating findings into decisions.',
    'Tốt nghiệp ngành Kinh doanh tại Swinburne University, với 11 dự án ứng dụng về nghiên cứu thị trường, thấu hiểu người tiêu dùng, phân tích khảo sát, phân tích văn bản, báo cáo và khám phá dữ liệu có hỗ trợ AI. Công việc tập trung vào đặt đúng câu hỏi, xây bằng chứng rõ và chuyển kết quả phân tích thành hướng ra quyết định.'
  ],
  [
    'This portfolio is published under Chung Hy Dai and may also appear as Dai Chung Hy in reversed-name references. It is organized for market research, consumer insights, and applied analytics review.',
    'Portfolio được xuất bản dưới tên Chung Hy Dai và đôi khi có thể xuất hiện dưới dạng Dai Chung Hy khi thứ tự họ tên bị đảo. Nội dung được tổ chức để phục vụ việc xem xét năng lực nghiên cứu thị trường, thấu hiểu người tiêu dùng và phân tích ứng dụng.'
  ],
  [
    'Profile feature · Published December 2025',
    'Profile feature · Tháng 12/2025'
  ],
  [
    'External profile covering applied project work at Swinburne Vietnam.',
    'Bài viết bên ngoài về các dự án ứng dụng tại Swinburne Vietnam.'
  ],
  [
    'Vietnamese (native) · English (IELTS Academic 6.0) · Work authorization details available on request.',
    'Tiếng Việt (native) · Tiếng Anh (IELTS Academic 6.0) · Thông tin quyền làm việc có thể trao đổi khi cần.'
  ],
  [
    'Research claims are linked to case pages, profile links, and source notes.',
    'Các nhận định nghiên cứu được nối với trang nghiên cứu, liên kết hồ sơ và ghi chú nguồn.'
  ],
  [
    'Case pages remain available for method detail, source notes, and proof of work.',
    'Các trang case vẫn được giữ để xem chi tiết phương pháp, ghi chú nguồn và minh chứng công việc.'
  ],
  [
    'Questions, samples, methods, and evidence standards',
    'Câu hỏi nghiên cứu, mẫu, phương pháp và chuẩn bằng chứng'
  ],
  [
    'Executive summaries, dashboards, and decision notes',
    'Tóm tắt điều hành, bảng thông tin và ghi chú phục vụ quyết định'
  ],
  [
    'Structured exploration with clear source boundaries',
    'Khám phá dữ liệu có cấu trúc, với ranh giới nguồn rõ ràng'
  ],
  [
    'Projects are organized by domain, method, and decision context for structured review.',
    'Các dự án được sắp theo mảng, phương pháp và bối cảnh quyết định để dễ xem xét.'
  ],
  [
    'The portfolio is easier to read as a work system: define the question, analyze the evidence, then report what matters.',
    'Portfolio sẽ dễ đọc hơn khi xem như một hệ thống công việc: xác định câu hỏi, phân tích bằng chứng, rồi báo cáo điều quan trọng.'
  ],
  [
    'Market research, reporting, and AI-enabled analysis.',
    'Nghiên cứu thị trường, báo cáo và phân tích có hỗ trợ AI.'
  ],
  [
    'Problem framing and evidence design',
    'Định khung vấn đề và thiết kế bằng chứng'
  ],
  [
    'Research questions, survey logic, sample context, and method choices are made clear before the findings.',
    'Câu hỏi nghiên cứu, logic survey, bối cảnh mẫu và lựa chọn phương pháp được làm rõ trước khi trình bày kết quả.'
  ],
  [
    'Question design',
    'Thiết kế câu hỏi'
  ],
  [
    'Insight summaries and decision notes',
    'Tóm tắt phát hiện và ghi chú quyết định'
  ],
  [
    'Findings are translated into concise reports, executive summaries, visual outputs, and practical next steps.',
    'Kết quả được chuyển thành báo cáo gọn, tóm tắt điều hành, hình ảnh phân tích và bước tiếp theo cụ thể.'
  ],
  [
    'Storyline',
    'Storyline'
  ],
  [
    'Decision support',
    'Hỗ trợ quyết định'
  ],
  [
    'AI-assisted exploration',
    'Khám phá dữ liệu có hỗ trợ AI'
  ],
  [
    'AI is used to speed up exploration, structure themes, and improve review flow while keeping evidence boundaries visible.',
    'AI được dùng để tăng tốc bước khám phá, nhóm chủ đề và làm quy trình xem xét rõ hơn, đồng thời vẫn giữ ranh giới bằng chứng.'
  ],
  [
    'Exploration',
    'Khám phá'
  ],
  [
    'Quality check',
    'Kiểm tra chất lượng'
  ],
  [
    'Survey, text, and model outputs',
    'Kết quả từ khảo sát, văn bản và mô hình'
  ],
  [
    'Projects combine survey analysis, text analytics, segmentation, experiments, and statistical interpretation.',
    'Các dự án kết hợp phân tích khảo sát, phân tích văn bản, phân khúc, thử nghiệm và diễn giải thống kê.'
  ],
  [
    'Survey data',
    'Dữ liệu khảo sát'
  ],
  [
    'Profile, methods, and proof',
    'Hồ sơ, phương pháp và bằng chứng'
  ],
  [
    'The site separates profile context, work samples, credentials, and profile links for easier review.',
    'Site tách rõ bối cảnh hồ sơ, mẫu công việc, chứng chỉ và liên kết hồ sơ để người xem xét kiểm tra nhanh hơn.'
  ],
  [
    'Suggested reading path: start with the profile, skim selected work, then use credentials and profile links for verification.',
    'Cách đọc gợi ý: bắt đầu từ hồ sơ, lướt các dự án chọn lọc, rồi dùng chứng chỉ và liên kết hồ sơ để kiểm chứng.'
  ],
  [
    'Suggested reading path: start with the profile, scan the full project rail, then use credentials and profile links only when verification is needed.',
    'Cách đọc gợi ý: bắt đầu từ hồ sơ, lướt toàn bộ dải dự án, rồi dùng chứng chỉ và liên kết hồ sơ khi cần kiểm chứng.'
  ],
  [
    'Eleven projects are shown here, not a selected subset. Scroll sideways to scan the full portfolio quickly.',
    'Mục này hiển thị đủ 11 dự án, không chỉ chọn lọc vài dự án. Kéo ngang để xem nhanh toàn bộ portfolio.'
  ],
  [
    'Eleven market research, consumer insights, and applied analytics projects across hospitality segmentation, EV choice, policy acceptance, influencer retention, buffet nudging, nutrition, and organizational behavior. The archive shows the full project set for quick scanning.',
    'Mười một dự án nghiên cứu thị trường, thấu hiểu người tiêu dùng và phân tích ứng dụng, bao gồm phân khúc lưu trú, lựa chọn xe điện, mức chấp nhận chính sách, khả năng giữ chân người theo dõi, sắp xếp thực đơn, dinh dưỡng và hành vi tổ chức. Kho này hiển thị đầy đủ dự án để xem nhanh.'
  ],
  [
    'Use the domain cards when you want a cleaner path through related methods and decision contexts.',
    'Dùng các thẻ theo mảng khi cần một tuyến đọc gọn hơn theo phương pháp và bối cảnh ra quyết định liên quan.'
  ],
  [
    'Portfolio navigation: profile, research archive, domain clusters, credentials, and short research insights.',
    'Điều hướng portfolio: hồ sơ, kho nghiên cứu, cụm mảng, chứng chỉ và ghi chú nghiên cứu ngắn.'
  ],
  [
    'These sections collect profile links, publication records, and short study interpretations.',
    'Các mục này gom liên kết hồ sơ, hồ sơ công bố và phần diễn giải ngắn cho từng nghiên cứu.'
  ],
  [
    'Credentials and research insights.',
    'Chứng chỉ và ghi chú nghiên cứu.'
  ],
  [
    'Public profiles, publication records, conference pages, and portfolio-hosted research files tied to the same identity.',
    'Hồ sơ công khai, hồ sơ công bố, trang hội thảo và file nghiên cứu trên portfolio được nối về cùng một danh tính.'
  ],
  [
    'Short research insights on EV choice, student diet quality, and virtual influencer trust.',
    'Ghi chú nghiên cứu ngắn về lựa chọn xe điện, chất lượng ăn uống của sinh viên và niềm tin với nhân vật ảnh hưởng ảo.'
  ],
  [
    'Brief interpretations that connect selected case outputs to practical implications.',
    'Các diễn giải ngắn nối output từ case chọn lọc với hàm ý thực tế.'
  ],
  [
    'Degree completion is listed for context. Document images are not published because they contain private identifiers.',
    'Thông tin tốt nghiệp được nêu để cung cấp bối cảnh. Ảnh giấy tờ không được công bố vì có thông tin định danh cá nhân.'
  ],
  [
    'Used large-scale hotel review data to support tourism and service decisions.',
    'Dùng dữ liệu review khách sạn quy mô lớn để hỗ trợ quyết định trong du lịch và dịch vụ.'
  ],
  [
    'Strategic consulting for corporate expansion within 24-hour sprints.',
    'Tư vấn chiến lược cho bài toán mở rộng doanh nghiệp trong sprint 24 giờ.'
  ],
  [
    'Organized club activities and supported internal operations for orientation programs and business competitions.',
    'Tổ chức hoạt động câu lạc bộ và hỗ trợ vận hành nội bộ cho chương trình orientation và business competition.'
  ],
  [
    'Coordinated volunteer shifts and on-site logistics with a team of 30+ volunteers.',
    'Điều phối ca tình nguyện và logistics tại sự kiện với đội hơn 30 tình nguyện viên.'
  ],
  [
    'Three projects that show the question, the method, and the decision.',
    'Ba dự án thể hiện câu hỏi, phương pháp và giá trị cho quyết định.'
  ],
  [
    'Hotel teams required clearer patterns in guest feedback.',
    'Đội ngũ khách sạn cần nhìn rõ hơn các pattern trong feedback của khách.'
  ],
  [
    'Analyzed 74,896 reviews across 458 hotels and grouped recurring issues.',
    'Phân tích 74.896 review từ 458 khách sạn và gom nhóm các vấn đề lặp lại.'
  ],
  [
    'Built a 10-segment view of guest needs and service pain points.',
    'Xây dựng góc nhìn 10 segment về nhu cầu và pain point dịch vụ của khách.'
  ],
  [
    'EV teams require evidence on which product attributes buyers value most.',
    'Đội ngũ EV cần bằng chứng về những thuộc tính sản phẩm mà người mua đánh giá cao nhất.'
  ],
  [
    'Ran a choice experiment with 212 young consumers in Hanoi and HCMC.',
    'Chạy choice experiment với 212 người tiêu dùng trẻ tại Hà Nội và TP. Hồ Chí Minh.'
  ],
  [
    'Showed a split between pragmatic buyers and design-led buyers.',
    'Cho thấy sự tách nhóm giữa người mua thực dụng và người mua bị dẫn dắt bởi thiết kế.'
  ],
  [
    'Policy change fails when support measures come too late.',
    'Thay đổi chính sách dễ thất bại khi các biện pháp hỗ trợ đến quá muộn.'
  ],
  [
    'Tested how residents respond to different policy and support bundles.',
    'Kiểm tra cách cư dân phản ứng với các gói chính sách và hỗ trợ khác nhau.'
  ],
  [
    'Support-first rollout paths were more acceptable than restriction-first paths.',
    'Lộ trình ưu tiên hỗ trợ được chấp nhận tốt hơn lộ trình ưu tiên hạn chế.'
  ],
  [
    'Recognized with the Aspiring Star research prize at Greenovation.',
    'Được ghi nhận với giải Aspiring Star research prize tại Greenovation.'
  ],
  [
    'Advanced to the Champion Round and presented strategic recommendations to industry judges under strict time constraints.',
    'Vào Champion Round và trình bày khuyến nghị chiến lược trước ban giám khảo ngành trong giới hạn thời gian chặt.'
  ],
  [
    'Awarded a partial scholarship for the Bachelor of Business program based on high school academic results and entrance examinations.',
    'Nhận học bổng bán phần cho chương trình Bachelor of Business dựa trên kết quả học tập THPT và kỳ xét tuyển đầu vào.'
  ],
  [
    'Recognized for strong academic performance in project management, introduction to marketing and consumer behavior, and market research.',
    'Được ghi nhận về kết quả học tập tốt ở project management, introduction to marketing and consumer behavior, và market research.'
  ],
  [
    'Score report available on request.',
    'Có thể cung cấp score report khi cần.'
  ],
  [
    'Score report available on request; image proof is not published because it contains private identifiers.',
    'Có thể cung cấp score report khi cần; ảnh bằng chứng không được công bố vì có thông tin định danh cá nhân.'
  ],
  [
    'Certificate proof is available on request; image proof is not published because it contains private identifiers.',
    'Có thể cung cấp bằng chứng chứng chỉ khi cần; ảnh bằng chứng không được công bố vì có thông tin định danh cá nhân.'
  ],
  [
    'The page you requested is unavailable. Use the homepage or projects archive to continue browsing the portfolio.',
    'Trang bạn yêu cầu hiện không khả dụng. Hãy dùng trang chủ hoặc kho dự án để tiếp tục xem portfolio.'
  ],

  [
    'About Chung Hy Dai | Education, Research Focus, and Evidence Standards',
    'Giới thiệu Chung Hy Dai | Học vấn, trọng tâm nghiên cứu và chuẩn bằng chứng'
  ],
  [
    'About Chung Hy Dai, including education context, research focus, working method, and evidence standards.',
    'Giới thiệu Chung Hy Dai, gồm bối cảnh học vấn, trọng tâm nghiên cứu, cách làm việc và chuẩn bằng chứng.'
  ],
  [
    'Education context, research scope, working method, and evidence standards for applied market research, consumer insights, and decision-oriented analytics.',
    'Bối cảnh học vấn, phạm vi nghiên cứu, cách làm việc và chuẩn bằng chứng cho nghiên cứu thị trường ứng dụng, insight người tiêu dùng và phân tích hướng đến quyết định.'
  ],
  [
    'Portfolio for market research and consumer insights roles',
    'Portfolio cho các vị trí nghiên cứu thị trường và thấu hiểu người tiêu dùng'
  ],
  [
    'Marketing graduate from Swinburne University of Technology with project work across hospitality, mobility, creator economy, health behavior, and organizational settings.',
    'Tốt nghiệp Marketing tại Swinburne University of Technology, với các dự án trong mảng lưu trú, giao thông, kinh tế nhà sáng tạo nội dung, hành vi sức khỏe và bối cảnh tổ chức.'
  ],
  [
    'The portfolio is published under Chung Hy Dai and may also appear as Dai Chung Hy when the family-name order is reversed.',
    'Portfolio dùng tên Chung Hy Dai và có thể xuất hiện dưới dạng Dai Chung Hy khi thứ tự họ tên bị đảo.'
  ],
  [
    'Each research page distinguishes between verified, self-reported, derived, and conceptual material so claims remain interview-defensible.',
    'Mỗi trang nghiên cứu phân biệt rõ phần đã xác thực, tự báo cáo, suy luận từ dữ liệu và khái niệm để nhận định vẫn có thể bảo vệ khi phỏng vấn.'
  ],
  [
    'The site is built for market research analyst, consumer insights analyst, and applied analytics review rather than generic blogging. Pages emphasize problem framing, methods, evidence, and decision value.',
    'Site được xây cho việc xem xét năng lực phân tích nghiên cứu thị trường, thấu hiểu người tiêu dùng và phân tích ứng dụng, không phải blog chung chung. Các trang nhấn vào cách định khung vấn đề, phương pháp, bằng chứng và giá trị cho quyết định.'
  ],
  [
    'Recommended navigation starts with research domains, continues into case pages, and then moves to credentials or profile links for verification.',
    'Cách đọc khuyến nghị là bắt đầu từ các mảng nghiên cứu, đi tiếp vào trang nghiên cứu, rồi dùng chứng chỉ hoặc liên kết hồ sơ để kiểm chứng.'
  ],
  [
    'Domain pages group market research, consumer insights, and applied analytics projects by topic, method, and decision context.',
    'Các trang mảng gom dự án nghiên cứu thị trường, thấu hiểu người tiêu dùng và phân tích ứng dụng theo chủ đề, phương pháp và bối cảnh quyết định.'
  ],
  [
    'Core case studies include EV choice, Hanoi mobility policy, hotel segmentation, and creator-economy research.',
    'Các nghiên cứu trọng tâm gồm lựa chọn xe điện, chính sách giao thông tại Hà Nội, phân khúc khách sạn và nghiên cứu kinh tế nhà sáng tạo nội dung.'
  ],
  [
    'Research pages include source notes, publication references where available, and clear tier labels for self-reported, derived, and conceptual claims.',
    'Các trang nghiên cứu có ghi chú nguồn, tài liệu công bố khi có, và nhãn tầng rõ ràng cho nhận định tự báo cáo, suy luận từ dữ liệu và khái niệm.'
  ],
  [
    'These pages organize the case archive by research domain, method family, and applied decision context.',
    'Các trang này sắp xếp kho nghiên cứu theo mảng nghiên cứu, nhóm phương pháp và bối cảnh quyết định ứng dụng.'
  ],
  [
    'Methods vary by topic, but the workflow remains consistent: define the decision, design the evidence, translate results into action, and label uncertainty clearly.',
    'Phương pháp thay đổi theo chủ đề, nhưng workflow giữ nhất quán: xác định quyết định cần hỗ trợ, thiết kế bằng chứng, chuyển kết quả thành hành động và gắn nhãn bất định rõ ràng.'
  ],
  [
    'The work prioritizes clear questions that a project owner, operations lead, or research reviewer can use to make a decision.',
    'Các dự án ưu tiên câu hỏi rõ ràng để chủ dự án, người phụ trách vận hành hoặc người xem xét nghiên cứu có thể dùng khi ra quyết định.'
  ],
  [
    'The portfolio includes sentiment analysis, clustering, discrete choice experiments, structural equation modeling, regression, and decision translation.',
    'Portfolio gồm phân tích cảm xúc, phân cụm, thử nghiệm lựa chọn rời rạc, mô hình phương trình cấu trúc, hồi quy và chuyển dịch kết quả thành quyết định.'
  ],
  [
    'The portfolio separates verified publication output, self-reported project work, derived interpretation, and conceptual framing.',
    'Portfolio tách riêng kết quả công bố đã xác thực, dự án tự báo cáo, diễn giải suy luận từ dữ liệu và khung khái niệm.'
  ],
  [
    'These signals help search systems and reviewers connect the portfolio to a consistent professional identity.',
    'Các tín hiệu này giúp hệ thống tìm kiếm và người review nối portfolio với một danh tính nghề nghiệp nhất quán.'
  ],
  [
    'External article about applied project work and research activity.',
    'Bài viết bên ngoài về dự án ứng dụng và hoạt động nghiên cứu.'
  ],
  [
    'Persistent academic identifier used across the portfolio and research references.',
    'Mã định danh học thuật ổn định được dùng xuyên suốt portfolio và các tham chiếu nghiên cứu.'
  ],
  [
    'Professional profile aligned with the same name, topic areas, and contact route.',
    'Hồ sơ nghề nghiệp khớp cùng tên, cùng mảng chủ đề và cùng đường liên hệ.'
  ],
  [
    'Public code and repository profile connected to the same name and portfolio identity.',
    'Hồ sơ code và repository công khai nối với cùng tên và danh tính portfolio.'
  ],
  [
    'Use the research domains, case archive, credentials, or email route for specific project context.',
    'Dùng mảng nghiên cứu, kho nghiên cứu, chứng chỉ hoặc email để xem bối cảnh cụ thể của từng dự án.'
  ],
  [
    'This page consolidates scope, methodology, evidence standards, and navigation for the portfolio.',
    'Trang này gom phạm vi, phương pháp, chuẩn bằng chứng và cách điều hướng portfolio.'
  ],

  [
    'Eleven market research, consumer insights, and applied analytics projects across hospitality segmentation, EV choice, policy acceptance, influencer retention, buffet nudging, nutrition, and organizational behavior. Priority case studies include EV choice, motorbike policy, hotel segmentation, and service-quality research.',
    'Mười một dự án về nghiên cứu thị trường, thấu hiểu người tiêu dùng và phân tích ứng dụng, bao gồm phân khúc khách sạn, lựa chọn xe điện, mức chấp nhận chính sách, khả năng giữ chân người theo dõi, sắp xếp thực đơn, dinh dưỡng và hành vi tổ chức. Các nghiên cứu ưu tiên gồm lựa chọn xe điện, chính sách xe máy, phân khúc khách sạn và nghiên cứu chất lượng dịch vụ.'
  ],
  [
    'Research Projects | Chung Hy Dai',
    'Dự án nghiên cứu | Chung Hy Dai'
  ],
  [
    'Research projects by Chung Hy Dai across hospitality segmentation, EV choice, policy acceptance, influencer retention, buffet nudging, nutrition, and organizational behavior.',
    'Các dự án nghiên cứu của Chung Hy Dai về phân khúc khách sạn, lựa chọn xe điện, mức chấp nhận chính sách, khả năng giữ chân người theo dõi, sắp xếp thực đơn, dinh dưỡng và hành vi tổ chức.'
  ],
  [
    'Each domain page groups related studies, defines the decision context, and links adjacent case pages within the research archive.',
    'Mỗi trang mảng gom các nghiên cứu liên quan, làm rõ bối cảnh quyết định và nối sang các nghiên cứu gần kề trong kho.'
  ],
  [
    'Review the project archive, then use the main portfolio for experience, skills, and credentials.',
    'Xem kho dự án trước, rồi dùng portfolio chính để kiểm tra kinh nghiệm, kỹ năng và chứng chỉ.'
  ],
  [
    'Contact by email for research, analytics, operations, or project context.',
    'Liên hệ qua email cho nghiên cứu, phân tích, vận hành hoặc bối cảnh dự án.'
  ],

  [
    'Research Insights | EV Choice, Diet Quality, and Virtual Influencer Trust | Chung Hy Dai',
    'Ghi chú nghiên cứu | Lựa chọn xe điện, chất lượng ăn uống và niềm tin với nhân vật ảnh hưởng ảo | Chung Hy Dai'
  ],
  [
    'Short research insights by Chung Hy Dai covering EV choice in Vietnam, student diet quality, and virtual influencer trust.',
    'Các ghi chú nghiên cứu ngắn của Chung Hy Dai về lựa chọn xe điện tại Việt Nam, chất lượng ăn uống của sinh viên và niềm tin với nhân vật ảnh hưởng ảo.'
  ],
  [
    'Brief interpretations of selected case studies, with direct links to the full research pages and practical implications.',
    'Diễn giải ngắn cho các nghiên cứu tình huống chọn lọc, kèm liên kết trực tiếp đến trang nghiên cứu đầy đủ và hàm ý thực tế.'
  ],
  [
    'Each insight gives the main idea before linking to the complete case page.',
    'Mỗi ghi chú đưa ý chính trước, sau đó liên kết đến trang nghiên cứu đầy đủ.'
  ],
  [
    'The summaries focus on what the result means for product, policy, health, or creator-economy decisions.',
    'Các phần tóm tắt tập trung vào ý nghĩa của kết quả cho quyết định về sản phẩm, chính sách, sức khỏe hoặc kinh tế nhà sáng tạo nội dung.'
  ],
  [
    'Every insight links back to the relevant case study and topic cluster.',
    'Mỗi ghi chú đều liên kết về nghiên cứu tình huống và cụm chủ đề liên quan.'
  ],
  [
    'Three short insight pages.',
    'Ba trang ghi chú ngắn.'
  ],
  [
    'Each page gives a quick interpretation and links to the complete research case.',
    'Mỗi trang đưa phần diễn giải nhanh và liên kết đến nghiên cứu đầy đủ.'
  ],
  [
    'Use these pages as quick entry points, then open the full case pages for methods and evidence.',
    'Dùng các trang này để đọc nhanh, sau đó mở nghiên cứu đầy đủ để xem phương pháp và bằng chứng.'
  ],
  [
    'The insight pages are short summaries, not replacements for the full research pages.',
    'Các trang ghi chú là phần tóm tắt ngắn, không thay thế trang nghiên cứu đầy đủ.'
  ],
  [
    'Move from summary to full case studies.',
    'Đi từ tóm tắt sang case study đầy đủ.'
  ],
  [
    'Open the complete research pages for methodology, evidence, and source context.',
    'Mở trang nghiên cứu đầy đủ để xem phương pháp, bằng chứng và bối cảnh nguồn.'
  ],
  [
    'Use the summaries for a quick read, then review the archive or contact by email for full project context.',
    'Dùng các phần tóm tắt để đọc nhanh, sau đó xem archive hoặc liên hệ qua email để có đầy đủ bối cảnh dự án.'
  ],

  [
    'Hospitality Analytics Research | Hotel Segmentation and Service Quality | Chung Hy Dai',
    'Nghiên cứu phân tích lưu trú | Phân khúc khách sạn và chất lượng dịch vụ | Chung Hy Dai'
  ],
  [
    'Hospitality analytics research by Chung Hy Dai covering hotel customer segmentation, attribute asymmetry, and value frameworks for service decision-making.',
    'Nghiên cứu phân tích lưu trú của Chung Hy Dai về phân khúc khách hàng khách sạn, bất đối xứng thuộc tính và khung giá trị cho quyết định dịch vụ.'
  ],
  [
    'This cluster brings together the hospitality work in the portfolio: hotel customer segmentation, attribute asymmetry, and value frameworks. This page groups market research, consumer insights, and applied analytics work for hospitality teams that require more than high-level ratings.',
    'Cụm này gom các dự án lưu trú trong portfolio: phân khúc khách hàng khách sạn, bất đối xứng thuộc tính và khung giá trị. Trang này dành cho các đội dịch vụ lưu trú cần nhiều hơn điểm đánh giá tổng quát.'
  ],
  [
    'This topic examines guest differences, rating penalties, and service actions derived from experience signals.',
    'Mảng này xem xét khác biệt giữa các nhóm khách, mức phạt điểm đánh giá và hành động dịch vụ rút ra từ tín hiệu trải nghiệm.'
  ],
  [
    'Which guests should a hotel prioritize, which attributes create the largest downside risk, and how should text data be translated into value-led action?',
    'Khách sạn nên ưu tiên nhóm khách nào, thuộc tính nào tạo rủi ro giảm điểm lớn nhất, và dữ liệu văn bản nên được chuyển thành hành động theo giá trị như thế nào?'
  ],
  [
    'The work supports prioritization, positioning, and service-quality diagnostics rather than generic dashboard reporting.',
    'Phần này hỗ trợ ưu tiên vận hành, định vị và chẩn đoán chất lượng dịch vụ, thay vì chỉ làm bảng thông tin chung chung.'
  ],
  [
    'The hospitality pages focus on differences rather than averages. They show where guest expectations separate, where hotel attributes behave asymmetrically, and how review text can inform action.',
    'Các trang lưu trú tập trung vào khác biệt thay vì chỉ nhìn trung bình. Chúng cho thấy kỳ vọng của khách tách ra ở đâu, thuộc tính khách sạn bất đối xứng thế nào, và văn bản đánh giá có thể dẫn đến hành động ra sao.'
  ],
  [
    'Hotel rating averages flatten distinct segments. Segmentation is used here to recover meaningful guest patterns from review text.',
    'Điểm trung bình của khách sạn có thể làm phẳng các phân khúc khác nhau. Phân khúc ở đây giúp lấy lại mẫu hình có ý nghĩa từ văn bản đánh giá.'
  ],
  [
    'Some hotel attributes matter more when they fail than when they succeed. That asymmetry matters for operational prioritization.',
    'Một số thuộc tính khách sạn quan trọng hơn khi thất bại so với khi làm tốt. Sự bất đối xứng đó ảnh hưởng trực tiếp đến ưu tiên vận hành.'
  ],
  [
    'Framework pages are included when they help convert raw evidence into service, value, and positioning decisions.',
    'Các trang khung phân tích được giữ lại khi chúng giúp chuyển bằng chứng thô thành quyết định về dịch vụ, giá trị và định vị.'
  ],
  [
    'These pages provide the datasets, visuals, and method detail behind this topic cluster.',
    'Các trang này cung cấp dữ liệu, hình minh họa và chi tiết phương pháp phía sau cụm chủ đề này.'
  ],
  [
    'Maps 10 hotel guest segments from Booking.com reviews in Da Nang for more precise service action.',
    'Lập bản đồ 10 phân khúc khách sạn từ đánh giá Booking.com tại Đà Nẵng để hành động dịch vụ chính xác hơn.'
  ],
  [
    'Shows which attributes generate bigger penalties, rewards, or baseline expectations in hotel reviews.',
    'Cho thấy thuộc tính nào tạo mức phạt, lợi ích hoặc kỳ vọng nền lớn hơn trong đánh giá khách sạn.'
  ],
  [
    'Translates text signals into functional, emotional, and social value actions for service teams.',
    'Chuyển tín hiệu văn bản thành hành động về giá trị chức năng, cảm xúc và xã hội cho đội dịch vụ.'
  ],
  [
    'Use the case pages for full context, or contact by email for hospitality analytics review.',
    'Dùng các trang nghiên cứu để xem đầy đủ bối cảnh, hoặc liên hệ qua email để xem xét phân tích lưu trú.'
  ],

  [
    'Mobility and Policy Research | EV Choice and Hanoi Transition | Chung Hy Dai',
    'Nghiên cứu giao thông và chính sách | Lựa chọn xe điện và chuyển đổi tại Hà Nội | Chung Hy Dai'
  ],
  [
    'Mobility and policy research by Chung Hy Dai covering EV choice trade-offs and public acceptance of Hanoi transition policy.',
    'Nghiên cứu giao thông và chính sách của Chung Hy Dai về đánh đổi khi chọn xe điện và mức chấp nhận của công chúng với chính sách chuyển đổi tại Hà Nội.'
  ],
  [
    'This cluster covers EV choice and public acceptance of transition policy. This page groups market research, consumer insights, and applied analytics work on mobility trade-offs, support sequencing, and the conditions under which people accept change instead of resisting it.',
    'Cụm này bao quát lựa chọn xe điện và mức chấp nhận của công chúng với chính sách chuyển đổi. Trang này gom các dự án về đánh đổi trong giao thông, thứ tự hỗ trợ và điều kiện khiến người dân chấp nhận thay đổi thay vì phản kháng.'
  ],
  [
    'Understanding how people trade off design, price, range, and support measures when mobility systems shift.',
    'Hiểu cách người dân cân nhắc thiết kế, giá, quãng đường và biện pháp hỗ trợ khi hệ thống giao thông thay đổi.'
  ],
  [
    'What do young consumers prioritize in EV products, and what sequencing makes restrictive policy more acceptable in Hanoi?',
    'Người tiêu dùng trẻ ưu tiên gì trong sản phẩm EV, và sequencing nào giúp chính sách hạn chế dễ được chấp nhận hơn tại Hà Nội?'
  ],
  [
    'The output is aimed at product, policy, and transition design rather than generic public-opinion storytelling.',
    'Đầu ra hướng đến thiết kế sản phẩm, chính sách và lộ trình chuyển đổi, không chỉ kể chuyện dư luận chung chung.'
  ],
  [
    'The common thread in these projects is that acceptance is conditional. People evaluate the burden of change against the readiness of alternatives, financial support, and the credibility of the overall transition package.',
    'Điểm chung của các dự án này là mức chấp nhận luôn có điều kiện. Người dân cân nhắc gánh nặng thay đổi cùng mức sẵn sàng của phương án thay thế, hỗ trợ tài chính và độ tin cậy của toàn bộ gói chuyển đổi.'
  ],
  [
    'EV work is structured around what people give up and what they are willing to pay for, not around broad attitudinal claims.',
    'Phần EV được cấu trúc quanh điều người mua phải đánh đổi và sẵn sàng trả tiền, không dựa vào claim thái độ quá rộng.'
  ],
  [
    'Support-first policy designs often change acceptance more than blunt restrictions alone.',
    'Thiết kế chính sách ưu tiên hỗ trợ thường thay đổi mức chấp nhận tốt hơn việc chỉ áp hạn chế mạnh.'
  ],
  [
    'The objective is to make product and policy options easier to prioritize, not only to estimate model coefficients.',
    'Mục tiêu là giúp ưu tiên phương án sản phẩm và chính sách dễ hơn, không chỉ ước lượng hệ số mô hình.'
  ],
  [
    'These pages hold the detailed visuals, assumptions, and modeling context for this focus area.',
    'Các trang này giữ phần hình ảnh, giả định và bối cảnh mô hình chi tiết cho mảng này.'
  ],
  [
    'Shows how transit and financial support can raise acceptance before broad restrictions land.',
    'Cho thấy transit và hỗ trợ tài chính có thể nâng mức chấp nhận trước khi áp dụng hạn chế rộng.'
  ],
  [
    'Use the case pages for full context, or contact by email for mobility and policy research review.',
    'Dùng các trang nghiên cứu để xem đầy đủ bối cảnh, hoặc liên hệ qua email để xem xét nghiên cứu giao thông và chính sách.'
  ],

  [
    'Creator Economy Research | Influencer Retention and Virtual Influencers | Chung Hy Dai',
    'Nghiên cứu kinh tế nhà sáng tạo nội dung | Khả năng quay lại và nhân vật ảnh hưởng ảo | Chung Hy Dai'
  ],
  [
    'Creator economy research by Chung Hy Dai covering influencer retention, engagement, brand transfer, and virtual influencer trust.',
    'Nghiên cứu kinh tế nhà sáng tạo nội dung của Chung Hy Dai về khả năng quay lại, mức gắn kết, chuyển giao giá trị thương hiệu và niềm tin với nhân vật ảnh hưởng ảo.'
  ],
  [
    'This cluster examines creator, platform, and audience relationships. It groups market research, consumer insights, and applied analytics work on influencer retention, virtual influencer trust, and purchase intention.',
    'Cụm này xem xét quan hệ giữa nhà sáng tạo nội dung, nền tảng và người xem. Trang này gom các dự án nghiên cứu thị trường, thấu hiểu người tiêu dùng và phân tích ứng dụng về khả năng quay lại, niềm tin với nhân vật ảnh hưởng ảo và ý định mua.'
  ],
  [
    'Understanding engagement quality, brand transfer, and the conditions under which digital personas become persuasive or fragile.',
    'Hiểu chất lượng gắn kết, chuyển giao giá trị thương hiệu và điều kiện khiến nhân vật số trở nên thuyết phục hoặc dễ mất hiệu lực.'
  ],
  [
    'What drives retention on UGC platforms, and what cues make virtual influencers credible enough to affect trust and buying intent?',
    'Điều gì thúc đẩy khả năng quay lại trên nền tảng UGC, và tín hiệu nào khiến nhân vật ảnh hưởng ảo đủ đáng tin để ảnh hưởng đến niềm tin và ý định mua?'
  ],
  [
    'The output helps frame creator strategy, brand-transfer risk, and audience trust instead of treating influence as a single surface metric.',
    'Đầu ra giúp định khung chiến lược nhà sáng tạo, rủi ro chuyển giao giá trị thương hiệu và niềm tin của người xem, thay vì xem sức ảnh hưởng như một chỉ số bề mặt.'
  ],
  [
    'Engagement that lasts, not just attention spikes.',
    'Mức gắn kết bền hơn, không chỉ là các đợt tăng chú ý ngắn.'
  ],
  [
    'This topic examines audience engagement, brand trust transfer, and the limits of digital novelty as a persuasive cue.',
    'Mảng này xem xét audience engagement, brand trust transfer và giới hạn của novelty kỹ thuật số như một cue thuyết phục.'
  ],
  [
    'Creator outcomes are treated as a system of content experience, expectation fit, and brand transfer rather than isolated engagement spikes.',
    'Kết quả của creator được xem như một hệ gồm content experience, expectation fit và brand transfer, không phải các spike engagement rời rạc.'
  ],
  [
    'Virtual influencer work asks where credibility, disclosure, and speciesism change the ceiling of persuasion.',
    'Nghiên cứu virtual influencer hỏi credibility, disclosure và speciesism thay đổi trần thuyết phục ở đâu.'
  ],
  [
    'The objective is to translate findings into creator or brand decisions that fit observed UGC behavior.',
    'Mục tiêu là chuyển findings thành quyết định creator hoặc brand phù hợp với hành vi UGC quan sát được.'
  ],
  [
    'These pages contain the main models, diagrams, and evidence framing for the creator cluster.',
    'Các trang này chứa mô hình, sơ đồ và cách đóng khung bằng chứng chính cho cụm creator.'
  ],
  [
    'Links experience quality, brand equity, and engagement to retention in Vietnamese UGC use.',
    'Nối experience quality, brand equity và engagement với retention trong bối cảnh dùng UGC tại Việt Nam.'
  ],
  [
    'Tests how credibility, argument quality, and speciesism shape Gen Z response to virtual personas.',
    'Kiểm tra cách credibility, argument quality và speciesism định hình phản ứng của Gen Z với virtual persona.'
  ],
  [
    'Use the case pages for full context, or contact by email for creator-economy project review.',
    'Dùng các trang case để xem đầy đủ bối cảnh, hoặc liên hệ qua email để review dự án creator economy.'
  ],

  [
    'Health and Behavior Research | Nutrition and Menu Nudging | Chung Hy Dai',
    'Nghiên cứu Health & Behavior | Nutrition và Menu Nudging | Chung Hy Dai'
  ],
  [
    'Health and behavior research by Chung Hy Dai covering nutrition, diet quality, and menu nudging in applied decision contexts.',
    'Nghiên cứu health và behavior của Chung Hy Dai về nutrition, diet quality và menu nudging trong bối cảnh quyết định ứng dụng.'
  ],
  [
    'This cluster focuses on behavior change in food and health contexts. This page groups market research, consumer insights, and applied analytics work on how knowledge, activity, and menu design shape diet quality and intended choice in real decision environments.',
    'Cụm này tập trung vào thay đổi hành vi trong bối cảnh food và health. Trang này gom các dự án về cách knowledge, activity và menu design định hình diet quality và intended choice trong môi trường ra quyết định thực tế.'
  ],
  [
    'This topic examines how information, context, and design choices influence health-related behavior.',
    'Mảng này xem xét cách thông tin, bối cảnh và lựa chọn thiết kế ảnh hưởng đến hành vi liên quan đến health.'
  ],
  [
    'Which factors are associated with student diet quality, and how can menu structure influence intended intake or premium selection?',
    'Yếu tố nào liên quan đến diet quality của sinh viên, và cấu trúc menu có thể ảnh hưởng thế nào đến intended intake hoặc lựa chọn premium?'
  ],
  [
    'The output supports programs, food-service settings, and applied intervention design.',
    'Đầu ra hỗ trợ thiết kế chương trình, food-service setting và intervention ứng dụng.'
  ],
  [
    'This work does not treat health behavior as an abstract topic. It identifies levers that can inform intervention design and decision environments.',
    'Phần này không xem health behavior như một chủ đề trừu tượng. Nó xác định các lever có thể hỗ trợ thiết kế intervention và môi trường ra quyết định.'
  ],
  [
    'Behavior is often shaped by time, menu structure, access, and environment rather than just by personal intention.',
    'Hành vi thường bị định hình bởi thời gian, cấu trúc menu, khả năng tiếp cận và môi trường, không chỉ bởi ý định cá nhân.'
  ],
  [
    'Nutrition knowledge, physical activity, or ordering structure only matter if they can be translated into concrete action paths.',
    'Nutrition knowledge, physical activity hoặc ordering structure chỉ thật sự có giá trị khi được chuyển thành action path cụ thể.'
  ],
  [
    'The portfolio translates results into phased intervention or service-design implications instead of stopping at statistical significance.',
    'Portfolio chuyển kết quả thành hàm ý intervention theo giai đoạn hoặc service design, thay vì dừng ở statistical significance.'
  ],
  [
    'These pages contain the detail behind the nutrition and menu-design pieces in this cluster.',
    'Các trang này chứa phần chi tiết phía sau nghiên cứu nutrition và menu design trong cụm này.'
  ],
  [
    'Tests whether healthier-first menu ordering reduces intended intake and shifts premium-tier choice.',
    'Kiểm tra liệu cách sắp menu healthier-first có giảm intended intake và dịch chuyển lựa chọn premium tier hay không.'
  ],
  [
    'Maps which knowledge and activity factors are most strongly linked to better student diet quality.',
    'Map các yếu tố knowledge và activity có liên hệ mạnh nhất với diet quality tốt hơn ở sinh viên.'
  ],
  [
    'Use the case pages for full context, or contact by email for health-behavior project review.',
    'Dùng các trang case để xem đầy đủ bối cảnh, hoặc liên hệ qua email để review dự án health behavior.'
  ],

  [
    'Organizational Behavior Research | Ownership and Co-creation | Chung Hy Dai',
    'Nghiên cứu Organizational Behavior | Ownership và Co-creation | Chung Hy Dai'
  ],
  [
    'Organizational behavior research by Chung Hy Dai covering psychological ownership, co-creation, and participation design in education and service settings.',
    'Nghiên cứu organizational behavior của Chung Hy Dai về psychological ownership, co-creation và participation design trong bối cảnh giáo dục và dịch vụ.'
  ],
  [
    'This cluster covers psychological ownership in universities and co-creation in participatory service settings. It groups work on commitment, involvement, and repeat participation.',
    'Cụm này bao quát psychological ownership trong đại học và co-creation trong bối cảnh dịch vụ có sự tham gia. Các dự án tập trung vào commitment, involvement và repeat participation.'
  ],
  [
    'This topic examines how commitment and participation are shaped by ownership, social value, and co-created experience.',
    'Mảng này xem xét commitment và participation được định hình bởi ownership, social value và co-created experience như thế nào.'
  ],
  [
    'How do teams or participants become more invested, and which service or organizational cues make repeat participation more likely?',
    'Điều gì khiến team hoặc participant đầu tư công sức hơn, và cue nào trong dịch vụ hoặc tổ chức làm repeat participation dễ xảy ra hơn?'
  ],
  [
    'The output supports program design, engagement strategy, and commitment-building in educational or experiential contexts.',
    'Đầu ra hỗ trợ program design, engagement strategy và commitment-building trong bối cảnh giáo dục hoặc experiential.'
  ],
  [
    'This cluster examines why people remain involved, contribute, and identify with a setting or experience.',
    'Cụm này xem xét vì sao con người tiếp tục tham gia, đóng góp và thấy mình thuộc về một setting hoặc experience.'
  ],
  [
    'People commit more deeply when they feel a meaningful stake in what they are contributing to or participating in.',
    'Con người thường commit sâu hơn khi họ thấy mình có phần liên quan có ý nghĩa trong điều họ đóng góp hoặc tham gia.'
  ],
  [
    'Learning, social value, emotional value, and shared creation often work together rather than as isolated drivers.',
    'Learning, social value, emotional value và shared creation thường hoạt động cùng nhau, không phải các driver tách rời.'
  ],
  [
    'These pages translate frameworks into institutional and service-design applications.',
    'Các trang này chuyển framework thành ứng dụng trong institutional và service design.'
  ],
  [
    'These pages contain the main institutional and participatory studies in the portfolio.',
    'Các trang này chứa các nghiên cứu chính về institutional và participatory trong portfolio.'
  ],
  [
    'Translates ownership research into practical action for faculty, staff, and student teams.',
    'Chuyển nghiên cứu ownership thành hành động thực tế cho faculty, staff và student teams.'
  ],
  [
    'Shows how learning, social, and emotional value shape repeat workshop interest.',
    'Cho thấy learning, social value và emotional value định hình repeat workshop interest như thế nào.'
  ],
  [
    'Use the case pages for full context, or contact by email for organizational research review.',
    'Dùng các trang case để xem đầy đủ bối cảnh, hoặc liên hệ qua email để review nghiên cứu organizational.'
  ],

  [
    'EV Choice Experiment in Vietnam: What Design, Range, and Charging Tell Us',
    'EV Choice Experiment tại Việt Nam: thiết kế, range và sạc cho thấy điều gì'
  ],
  [
    'EV Choice Experiment in Vietnam: What Design, Range, and Charging Tell Us | Insights | Chung Hy Dai',
    'EV Choice Experiment tại Việt Nam: thiết kế, range và sạc cho thấy điều gì | Insights | Chung Hy Dai'
  ],
  [
    'Brief insight linking the EV discrete choice experiment to product positioning and message design for early EV buyers in Vietnam.',
    'Insight ngắn nối EV discrete choice experiment với product positioning và message design cho nhóm người mua EV giai đoạn đầu tại Việt Nam.'
  ],
  [
    'Brief insight by Chung Hy Dai on how young consumers in Vietnam trade off EV design, range, charging, and price in a discrete choice experiment.',
    'Insight ngắn của Chung Hy Dai về cách người tiêu dùng trẻ tại Việt Nam đánh đổi thiết kế EV, range, sạc và giá trong một discrete choice experiment.'
  ],
  [
    'The EV choice study is useful because it frames the purchase decision as a trade-off problem, not as a single-feature preference. Design matters, but it competes with range, charging convenience, and price reassurance in a young Vietnamese market that is still early in adoption.',
    'Nghiên cứu EV choice hữu ích vì xem quyết định mua như một bài toán trade-off, không phải sở thích cho một thuộc tính đơn lẻ. Thiết kế quan trọng, nhưng vẫn cạnh tranh với range, sự tiện lợi khi sạc và cảm giác yên tâm về giá trong một thị trường Việt Nam còn ở giai đoạn đầu.'
  ],
  [
    'A short interpretation of the nutrition study, focused on student diet quality, nutrition knowledge, and behavior patterns in Vietnam.',
    'Diễn giải ngắn về nghiên cứu nutrition, tập trung vào student diet quality, nutrition knowledge và pattern hành vi tại Việt Nam.'
  ],
  [
    'A short reading path for the EV case study, focused on design, range, charging, price, and practical product positioning.',
    'Tuyến đọc ngắn cho EV case study, tập trung vào thiết kế, range, sạc, giá và product positioning thực tế.'
  ],
  [
    'The value of this study is that it shows where the EV offer becomes believable and where it still feels risky to the buyer.',
    'Giá trị của nghiên cứu là chỉ ra khi nào đề xuất EV trở nên đáng tin và khi nào người mua vẫn cảm thấy rủi ro.'
  ],
  [
    'Design-led appeal is part of the story, especially for visually motivated buyers, but practical reassurance still shapes the final trade-off.',
    'Sức hút từ thiết kế là một phần của câu chuyện, nhất là với nhóm mua bị tác động bởi yếu tố thị giác. Nhưng sự yên tâm thực dụng vẫn định hình trade-off cuối cùng.'
  ],
  [
    'Charging convenience and usable range matter because they reduce the feeling that the buyer is taking on an operational burden after purchase.',
    'Sự tiện lợi khi sạc và range dùng được có ý nghĩa vì chúng giảm cảm giác người mua phải gánh thêm burden vận hành sau khi mua.'
  ],
  [
    'Experiment is more useful when read as a segment split between pragmatic and aesthetic preference rather than one average consumer profile.',
    'Experiment hữu ích hơn khi đọc như sự tách nhóm giữa preference thực dụng và aesthetic, thay vì một hồ sơ người tiêu dùng trung bình.'
  ],
  [
    'This insight is most useful when translated into positioning and communication choices rather than treated as an abstract result.',
    'Insight này hữu ích nhất khi được chuyển thành lựa chọn positioning và communication, thay vì xem như kết quả trừu tượng.'
  ],
  [
    'Design, range, and charging should be communicated together because the purchase decision appears to be bundle-sensitive.',
    'Design, range và charging nên được truyền thông cùng nhau vì quyết định mua có vẻ nhạy với bundle.'
  ],
  [
    'Design appeal becomes more persuasive when the offer reduces concern about charging and daily usability.',
    'Sức hút thiết kế thuyết phục hơn khi offer giảm được lo ngại về sạc và khả năng dùng hằng ngày.'
  ],
  [
    'The full EV page contains the detailed methodological context, segment framing, and visual evidence.',
    'Trang EV đầy đủ chứa bối cảnh phương pháp, segment framing và bằng chứng trực quan chi tiết.'
  ],
  [
    'Use this summary for a quick overview, then review the full EV case study or broader mobility research cluster.',
    'Dùng phần tóm tắt này để xem nhanh, sau đó mở EV case study đầy đủ hoặc cụm nghiên cứu mobility rộng hơn.'
  ],
  [
    'Student Diet Quality in Vietnam: Where Nutrition Knowledge Helps',
    'Student Diet Quality tại Việt Nam: khi nutrition knowledge tạo khác biệt'
  ],
  [
    'Brief insight translating the nutrition study into a clearer view of which knowledge and activity factors are associated with better student diet quality.',
    'Insight ngắn chuyển nghiên cứu nutrition thành góc nhìn rõ hơn về yếu tố knowledge và activity liên quan đến diet quality tốt hơn ở sinh viên.'
  ],
  [
    'Brief insight by Chung Hy Dai on student diet quality in Vietnam, focusing on nutrition knowledge, physical activity, and behavior patterns linked to healthier eating.',
    'Insight ngắn của Chung Hy Dai về student diet quality tại Việt Nam, tập trung vào nutrition knowledge, physical activity và behavior pattern liên quan đến ăn uống lành mạnh hơn.'
  ],
  [
    'The nutrition study is most useful as a behavior signal rather than a moral statement about healthy eating. The key question is which knowledge cues and activity routines are associated with better diet quality among students in Vietnam.',
    'Nghiên cứu nutrition hữu ích nhất khi được đọc như một tín hiệu hành vi, không phải phán xét đạo đức về ăn uống lành mạnh. Câu hỏi chính là knowledge cue và routine vận động nào liên quan đến diet quality tốt hơn ở sinh viên tại Việt Nam.'
  ],
  [
    'The value of the study is not only in whether one variable is significant. It is in the pattern it suggests about routine, awareness, and actionable behavior.',
    'Giá trị của nghiên cứu không chỉ nằm ở việc một biến có significant hay không. Nó nằm ở pattern về routine, nhận thức và hành vi có thể chuyển thành hành động.'
  ],
  [
    'The useful interpretation is not that information alone improves diet quality, but that actionable nutrition knowledge helps when it guides everyday food choices.',
    'Cách đọc hữu ích không phải là thông tin tự nó cải thiện diet quality, mà là nutrition knowledge có thể hành động sẽ hữu ích khi dẫn dắt lựa chọn ăn uống hằng ngày.'
  ],
  [
    'Activity patterns can indicate broader routine discipline, not just exercise itself, which helps explain why healthier behaviors often cluster together.',
    'Pattern vận động có thể phản ánh kỷ luật routine rộng hơn, không chỉ riêng việc tập luyện. Điều này giúp giải thích vì sao các hành vi lành mạnh thường đi cùng nhau.'
  ],
  [
    'Because the focus is students in Vietnam, the insight is relevant for campus behavior, health communication, and youth-facing nutrition programs rather than broad population claims.',
    'Vì trọng tâm là sinh viên tại Việt Nam, insight này phù hợp với campus behavior, health communication và chương trình nutrition cho người trẻ hơn là claim cho toàn dân số.'
  ],
  [
    'This insight is more useful when translated into behavior design, education framing, or campus communication rather than left as a general health finding.',
    'Insight này hữu ích hơn khi được chuyển thành behavior design, education framing hoặc campus communication, thay vì chỉ để như một phát hiện health chung.'
  ],
  [
    'Diet quality, knowledge, and activity can reinforce each other, which makes the study useful for program design and message sequencing.',
    'Diet quality, knowledge và activity có thể củng cố lẫn nhau, vì vậy nghiên cứu hữu ích cho program design và message sequencing.'
  ],
  [
    'Interventions are more persuasive when they make healthier choices easier to recognize and act on, not only easier to describe.',
    'Intervention thuyết phục hơn khi giúp lựa chọn lành mạnh dễ nhận ra và dễ làm theo, không chỉ dễ mô tả.'
  ],
  [
    'Use this summary for a quick overview, then review the full nutrition page or broader health-and-behavior cluster.',
    'Dùng phần tóm tắt này để xem nhanh, sau đó mở trang nutrition đầy đủ hoặc cụm health-and-behavior rộng hơn.'
  ],
  [
    'Virtual Influencer Trust: How Gen Z Trust Precedes Purchase Intention',
    'Virtual Influencer Trust: vì sao trust của Gen Z đi trước purchase intention'
  ],
  [
    'Brief insight on how credibility, trust cues, and creator framing shape virtual influencer response among Gen Z audiences.',
    'Insight ngắn về cách credibility, trust cue và creator framing định hình phản ứng của Gen Z với virtual influencer.'
  ],
  [
    'Brief insight by Chung Hy Dai on virtual influencer trust, credibility, and purchase intention in creator economy research focused on Gen Z audiences.',
    'Insight ngắn của Chung Hy Dai về virtual influencer trust, credibility và purchase intention trong nghiên cứu creator economy với trọng tâm Gen Z.'
  ],
  [
    'The most useful way to read the virtual influencer study is to treat trust and credibility as the gating variables. Purchase intention does not move first. It tends to follow when the virtual creator feels believable, coherent, and contextually fit for the audience.',
    'Cách đọc hữu ích nhất với nghiên cứu virtual influencer là xem trust và credibility như các biến cửa ngõ. Purchase intention không đi trước; nó thường đi sau khi virtual creator có vẻ đáng tin, nhất quán và hợp bối cảnh với audience.'
  ],
  [
    'A short interpretation of virtual influencer trust, credibility, and Gen Z purchase intention.',
    'Diễn giải ngắn về virtual influencer trust, credibility và purchase intention của Gen Z.'
  ],
  [
    'The research is most useful when it separates surface novelty from the cues that make a virtual influencer persuasive enough to affect intent.',
    'Nghiên cứu hữu ích nhất khi tách novelty bề mặt khỏi các cue khiến virtual influencer đủ thuyết phục để ảnh hưởng đến intent.'
  ],
  [
    'If the virtual influencer does not feel credible, purchase intention is unlikely to move in a durable way regardless of novelty or aesthetics.',
    'Nếu virtual influencer không đủ credible, purchase intention khó thay đổi bền vững dù có novelty hay aesthetic.'
  ],
  [
    'Gen Z response depends on whether the creator cue feels native to the audience context, not just technologically impressive.',
    'Phản ứng của Gen Z phụ thuộc vào việc creator cue có hợp với bối cảnh audience hay không, không chỉ phụ thuộc vào độ ấn tượng về công nghệ.'
  ],
  [
    'The surrounding content environment, message framing, and brand fit all shape how the virtual influencer is interpreted.',
    'Môi trường content xung quanh, message framing và brand fit đều định hình cách virtual influencer được diễn giải.'
  ],
  [
    'This insight is most valuable when translated into creator strategy, audience segmentation, and brand-fit decisions rather than novelty-driven experimentation.',
    'Insight này có giá trị nhất khi được chuyển thành creator strategy, audience segmentation và quyết định brand fit, thay vì chỉ thử nghiệm vì novelty.'
  ],
  [
    'Virtual creators require a believable identity, coherent behavior, and platform-fit cues before they can support brand or commerce goals.',
    'Virtual creator cần identity đáng tin, hành vi nhất quán và platform-fit cue trước khi có thể hỗ trợ mục tiêu brand hoặc commerce.'
  ],
  [
    'The character may attract attention, but trust and contextual credibility are what make downstream intent plausible.',
    'Nhân vật có thể thu hút attention, nhưng trust và credibility theo bối cảnh mới làm downstream intent trở nên hợp lý.'
  ],
  [
    'Use this summary for a quick overview, then review the publication-backed page or wider creator-economy research cluster.',
    'Dùng phần tóm tắt này để xem nhanh, sau đó mở trang có publication backing hoặc cụm creator-economy rộng hơn.'
  ],

  [
    'EV Choice Experiment in Vietnam | Design vs Range Trade-Offs | Chung Hy Dai',
    'EV Choice Experiment tại Việt Nam | Trade-off giữa thiết kế và range | Chung Hy Dai'
  ],
  [
    'This consumer insights study examines how young Vietnamese consumers trade off battery range, charging time, price, and design when choosing an EV.',
    'Nghiên cứu consumer insights này xem xét cách người tiêu dùng trẻ tại Việt Nam đánh đổi battery range, thời gian sạc, giá và thiết kế khi chọn EV.'
  ],
  [
    'This applied market research study asks a simple question: when EVs are also status symbols, how much range do young Vietnamese buyers trade for design and convenience?',
    'Nghiên cứu applied market research này đặt một câu hỏi đơn giản: khi EV cũng là status symbol, người mua trẻ tại Việt Nam sẵn sàng đánh đổi bao nhiêu range để lấy thiết kế và sự tiện lợi?'
  ],
  [
    'Range and charging times are major barriers to EV adoption. But does a',
    'Range và thời gian sạc là rào cản lớn với EV adoption. Nhưng liệu một'
  ],
  [
    'make buyers more forgiving of those trade-offs?',
    'có khiến người mua dễ chấp nhận những trade-off đó hơn không?'
  ],
  [
    'By capturing their choices, we estimated how much extra money consumers are willing to pay for a streamlined, sporty-looking EV.',
    'Bằng cách quan sát lựa chọn của họ, nghiên cứu ước tính người tiêu dùng sẵn sàng trả thêm bao nhiêu cho một EV có thiết kế streamlined và thể thao.'
  ],
  [
    'Higher prices reduce choice probability, while longer range increases preference.',
    'Giá cao hơn làm giảm xác suất được chọn, trong khi range dài hơn làm tăng preference.'
  ],
  [
    'For 35% of the market, a sleek design can justify slightly higher prices or slower charging times.',
    'Với 35% thị trường, thiết kế sleek có thể biện minh cho giá cao hơn một chút hoặc thời gian sạc chậm hơn.'
  ],
  [
    'Marketing a single "average" EV is dangerous. Brands must pick whether they are selling to the wallet or the heart.',
    'Marketing một chiếc EV "trung bình" cho tất cả là rủi ro. Brand cần chọn đang bán cho lý trí chi tiêu hay cho cảm xúc.'
  ],
  [
    'Play with the sliders to simulate an EV software/hardware upgrade. See instantly how much more the two different market segments are willing to pay for your improvements in',
    'Dùng slider để mô phỏng nâng cấp software/hardware cho EV. Xem ngay hai segment thị trường sẵn sàng trả thêm bao nhiêu cho cải tiến đó, tính bằng'
  ],
  [
    'They only pay for real utility.',
    'Nhóm này chỉ trả thêm cho utility thật.'
  ],
  [
    'They pay extra for the "cool" factor.',
    'Nhóm này trả thêm cho yếu tố "cool".'
  ],

  [
    'EV choice experiment with n = 212 maps design, range, price, and charging trade-offs across pragmatic and aesthetic consumer segments in Vietnam. n = 212 young consumers in.',
    'EV choice experiment với n = 212 map trade-off về design, range, giá và charging giữa hai segment pragmatic và aesthetic tại Việt Nam.'
  ],

  [
    'Hanoi Motorbike Phase-Out Policy Acceptance | Chung Hy Dai',
    'Mức chấp nhận chính sách phase-out xe máy tại Hà Nội | Chung Hy Dai'
  ],
  [
    'Using a discrete choice experiment for Hanoi residents, this study estimates how acceptance changes across policy bundles that combine restriction scope, travel cost changes, public transport improvements, fare relief, green reallocation, park-and-ride, transition support, and revenue governance. The analysis estimates mixed logit models, derives willingness-to-pay values, and identifies heterogeneity by dependency, income, trust, and environmental concern. Results show that a pull-first and support-first pathway is more acceptable than a push-first pathway.',
    'Dùng discrete choice experiment với cư dân Hà Nội, nghiên cứu này ước tính mức chấp nhận thay đổi thế nào giữa các policy bundle kết hợp phạm vi hạn chế, thay đổi chi phí đi lại, cải thiện giao thông công cộng, hỗ trợ giá vé, tái phân bổ không gian xanh, park-and-ride, hỗ trợ chuyển đổi và quản trị nguồn thu. Phân tích dùng mixed logit, suy ra willingness-to-pay và xác định heterogeneity theo mức phụ thuộc, thu nhập, trust và environmental concern. Kết quả cho thấy lộ trình pull-first và support-first dễ được chấp nhận hơn push-first.'
  ],
  [
    'Motorcycles remain the dominant mode, so restrictions without substitutes create mobility risk.',
    'Xe máy vẫn là phương tiện chủ đạo, nên hạn chế khi chưa có phương án thay thế sẽ tạo rủi ro mobility.'
  ],
  [
    'Public transport quality determines whether residents can absorb a transition away from fossil fuel vehicles.',
    'Chất lượng giao thông công cộng quyết định việc cư dân có thể hấp thụ chuyển đổi khỏi phương tiện dùng nhiên liệu hóa thạch hay không.'
  ],
  [
    'Cost and livelihood effects are stronger for lower-income and dependence-heavy groups.',
    'Tác động về chi phí và sinh kế mạnh hơn với nhóm thu nhập thấp và phụ thuộc nhiều vào xe máy.'
  ],
  [
    'Acceptance increases when households expect credible implementation and fair use of resources.',
    'Mức chấp nhận tăng khi hộ gia đình kỳ vọng triển khai đáng tin và nguồn lực được dùng công bằng.'
  ],
  [
    'Hanoi faces a policy dilemma. Air quality and congestion conditions justify intervention, but motorcycles remain central to household mobility and income generation. The implementation gap appears when restrictions move faster than alternatives.',
    'Hà Nội đối mặt với một policy dilemma. Chất lượng không khí và ùn tắc tạo lý do để can thiệp, nhưng xe máy vẫn là trung tâm của di chuyển hộ gia đình và tạo thu nhập. Khoảng trống triển khai xuất hiện khi hạn chế đi nhanh hơn phương án thay thế.'
  ],
  [
    'This study tests the conditions under which residents accept a fossil-fuel motorcycle phase-out package. It quantifies trade-offs among push, pull, and support attributes, then estimates preference heterogeneity across socioeconomic and attitudinal profiles.',
    'Nghiên cứu kiểm tra điều kiện khiến cư dân chấp nhận gói phase-out xe máy dùng nhiên liệu hóa thạch. Nó lượng hóa trade-off giữa thuộc tính push, pull và support, rồi ước tính preference heterogeneity theo đặc điểm kinh tế-xã hội và thái độ.'
  ],
  [
    'This study uses a stated-preference discrete choice experiment (DCE) under random utility theory. Respondents in Hanoi completed repeated choice tasks. In each task, they chose between policy bundles and a status-quo option.',
    'Nghiên cứu dùng stated-preference discrete choice experiment (DCE) theo random utility theory. Người trả lời tại Hà Nội hoàn thành nhiều choice task; trong mỗi task, họ chọn giữa các policy bundle và phương án status quo.'
  ],
  [
    'Each bundle was built from eight attributes with three levels each: restriction scope, travel-cost change, alternative transport quality, fare relief, transition support, green-space reallocation, park-and-ride, and revenue governance. The design generated 27 orthogonal profiles, split into 3 blocks; each respondent completed 9 tasks.',
    'Mỗi bundle gồm tám thuộc tính, mỗi thuộc tính có ba mức: phạm vi hạn chế, thay đổi chi phí đi lại, chất lượng phương án thay thế, hỗ trợ giá vé, hỗ trợ chuyển đổi, tái phân bổ không gian xanh, park-and-ride và quản trị nguồn thu. Thiết kế tạo 27 profile trực giao, chia thành 3 block; mỗi người trả lời hoàn thành 9 task.'
  ],
  [
    'We estimated mixed logit models for main effects and interaction effects. Interaction terms tested heterogeneity by motorcycle dependency, income, trust, and environmental concern. Willingness-to-pay values were calculated as coefficient ratios to the cost term, WTP',
    'Chúng tôi ước tính mixed logit cho main effects và interaction effects. Interaction terms kiểm tra heterogeneity theo mức phụ thuộc xe máy, thu nhập, trust và environmental concern. WTP được tính bằng tỷ lệ giữa hệ số thuộc tính và hệ số chi phí, WTP'
  ],
  [
    '). The design target was n = 400 and the realized sample was n = 320.',
    '). Cỡ mẫu mục tiêu là n = 400 và mẫu thực tế là n = 320.'
  ],
  [
    'The scenario simulation in Section 3A is directly linked to these estimated coefficients. It is not a market-share forecast. It is a transparent comparison tool that helps non-technical readers understand direction and relative magnitude across policy bundles.',
    'Phần mô phỏng kịch bản ở Section 3A liên kết trực tiếp với các hệ số ước tính. Đây không phải dự báo market share, mà là công cụ so sánh minh bạch giúp người đọc không chuyên hiểu hướng tác động và độ lớn tương đối giữa các policy bundle.'
  ],
  ['Transition pressure dimensions', 'Các áp lực trong quá trình chuyển đổi'],
  ['Dependency pressure', 'Áp lực phụ thuộc phương tiện'],
  ['Alternative capacity', 'Năng lực phương án thay thế'],
  ['Equity sensitivity', 'Độ nhạy về công bằng'],
  ['Trust condition', 'Điều kiện về trust'],
  ['Push coefficients are negative', 'Hệ số push mang dấu âm'],
  ['Pull and support coefficients are positive', 'Hệ số pull và support mang dấu dương'],
  ['Trust weakens status-quo lock-in', 'Trust làm giảm bám giữ status quo'],
  ['WTP indicates a compensation requirement', 'WTP cho thấy mức bù đắp cần thiết'],
  ['Deploy alternatives before restriction scale-up', 'Triển khai phương án thay thế trước khi mở rộng hạn chế'],
  ['Use gate-based monitoring for rollout control', 'Dùng monitoring theo mốc kiểm soát để quản lý rollout'],
  ['Primary mode', 'Phương tiện chính'],
  ['Motorcycle ownership', 'Sở hữu xe máy'],
  ['Model baseline', 'Baseline của mô hình'],
  ['Model fit', 'Độ phù hợp mô hình'],
  ['Core policy signal', 'Tín hiệu chính sách chính'],
  ['Metro and BRT expansion are policy pull anchors', 'Metro và BRT là các điểm tựa pull của chính sách'],
  ['Restriction design must account for dependence by necessity', 'Thiết kế hạn chế cần tính đến mức phụ thuộc vì nhu cầu thiết yếu'],
  ['Equity support is a central acceptance condition', 'Hỗ trợ công bằng là điều kiện trung tâm để tạo mức chấp nhận'],
  ['Distributional and procedural fairness shape support', 'Công bằng phân bổ và công bằng thủ tục định hình mức ủng hộ'],
  ['Street traffic in Hanoi with high motorcycle density (illustrative context image).', 'Mật độ xe máy cao trên đường phố Hà Nội (ảnh minh họa bối cảnh).'],
  ['Hanoi urban rail corridor used as transition-alternative context (illustrative image).', 'Tuyến đường sắt đô thị Hà Nội được dùng để minh họa phương án thay thế trong chuyển đổi.'],
  ['DCE attributes', 'Thuộc tính DCE'],
  ['8 attributes, 3 levels each', '8 thuộc tính, mỗi thuộc tính 3 mức'],
  ['Design profiles', 'Profile thiết kế'],
  ['27 orthogonal profiles', '27 profile trực giao'],
  ['Blocking', 'Chia block'],
  ['3 survey blocks', '3 block khảo sát'],
  ['Tasks per respondent', 'Task cho mỗi người trả lời'],
  ['9 choice tasks + status quo', '9 choice task + status quo'],
  ['Target n = 400, realized n = 320', 'Mục tiêu n = 400, thực tế n = 320'],
  ['Utility equation set', 'Bộ phương trình utility'],
  ['Utility decomposition', 'Tách utility'],
  ['Systematic utility', 'Utility hệ thống'],
  ['Monetary trade-off', 'Trade-off tiền tệ'],
  ['Method sequence', 'Trình tự phương pháp'],
  [
    'Study area definition, attribute design, orthogonal profile generation, blocked survey fieldwork, mixed logit estimation, interaction estimation, and WTP derivation.',
    'Xác định khu vực nghiên cứu, thiết kế thuộc tính, tạo profile trực giao, fieldwork theo block, ước tính mixed logit, ước tính interaction và suy ra WTP.'
  ],
  ['Figure 1. Mixed Logit Main Effects', 'Hình 1. Main effects từ mixed logit'],
  [
    'Reported coefficients and 95% confidence intervals from Table 3, grouped as push, pull, support-process, and status-quo terms.',
    'Hệ số đã báo cáo và khoảng tin cậy 95% từ Table 3, nhóm theo push, pull, support-process và status quo.'
  ],
  [
    'Mixed logit main effects: push coefficients are negative, while pull and support coefficients are positive.',
    'Main effects từ mixed logit: hệ số push mang dấu âm, trong khi hệ số pull và support mang dấu dương.'
  ],
  ['Figure 2. WTP and Heterogeneity Effects', 'Hình 2. WTP và heterogeneity effects'],
  [
    'Reported WTP ordering from Table 5 with selected interaction terms from Table 4. Positive values support acceptance; negative values indicate compensation required.',
    'Thứ tự WTP từ Table 5 cùng một số interaction term từ Table 4. Giá trị dương hỗ trợ mức chấp nhận; giá trị âm cho thấy cần bù đắp.'
  ],
  [
    'WTP ranking is led by e-motorcycle grants and stronger public transport quality; interactions show dependency, income, trust, and environmental-concern effects.',
    'Xếp hạng WTP dẫn đầu bởi hỗ trợ mua e-motorcycle và chất lượng giao thông công cộng tốt hơn; interaction cho thấy hiệu ứng của phụ thuộc, thu nhập, trust và environmental concern.'
  ],
  ['Restriction sensitivity', 'Độ nhạy với mức hạn chế'],
  [
    'Ban intensity produces the strongest negative effect, with substantial heterogeneity in the random term (σ for broad ban is large).',
    'Cường độ ban tạo tác động âm mạnh nhất, với heterogeneity đáng kể ở random term (σ của broad ban lớn).'
  ],
  ['Dependency and income effects', 'Hiệu ứng phụ thuộc và thu nhập'],
  [
    'Motorcycle dependency strengthens opposition to broad bans (β = -0.324). Higher income reduces cost sensitivity (β = +0.005) and lowers grant valuation (β = -0.018).',
    'Mức phụ thuộc xe máy làm tăng phản đối với broad ban (β = -0.324). Thu nhập cao hơn làm giảm độ nhạy chi phí (β = +0.005) và giảm valuation với khoản hỗ trợ (β = -0.018).'
  ],
  ['Trust mechanism', 'Cơ chế trust'],
  [
    'Trust lowers status-quo pull through the ASC interaction (β = -0.281), supporting a governance-first communication strategy.',
    'Trust làm giảm lực kéo status quo thông qua interaction với ASC (β = -0.281), ủng hộ chiến lược truyền thông đặt governance lên trước.'
  ],
  ['Environmental preference channel', 'Kênh environmental preference'],
  [
    'Environmental concern raises support for green-space reallocation (β = +0.217), indicating stronger acceptance of visible co-benefits.',
    'Environmental concern làm tăng ủng hộ với tái phân bổ không gian xanh (β = +0.217), cho thấy mức chấp nhận cao hơn khi co-benefit nhìn thấy được.'
  ],
  ['Policy Scenario Simulation', 'Mô phỏng kịch bản chính sách'],
  ['Coefficient-Based Scenario Simulation', 'Mô phỏng kịch bản dựa trên hệ số'],
  ['Simulation calculation (concise)', 'Cách tính mô phỏng (ngắn gọn)'],
  ['Simulation steps', 'Các bước mô phỏng'],
  ['1) Utility index', '1) Utility index'],
  ['Inputs are entered on 0-100 sliders and normalized to [0,1].', 'Input được nhập bằng slider 0-100 và chuẩn hóa về [0,1].'],
  ['2) Acceptance score', '2) Điểm chấp nhận'],
  ['3) High-acceptance chance', '3) Xác suất mức chấp nhận cao'],
  ['Shown as 1-99 to avoid false certainty.', 'Hiển thị trong khoảng 1-99 để tránh tạo cảm giác chắc chắn giả.'],
  [
    'Definitions:',
    'Định nghĩa:'
  ],
  [
    'Push = restriction scope and direct burden; Pull = alternative transport quality; Support = financial and implementation support; Trust = confidence in delivery and revenue governance.',
    'Push = phạm vi hạn chế và gánh nặng trực tiếp; Pull = chất lượng phương án thay thế; Support = hỗ trợ tài chính và hỗ trợ triển khai; Trust = niềm tin vào năng lực triển khai và quản trị nguồn thu.'
  ],
  ['Diagnostics:', 'Chẩn đoán:'],
  [
    'Alternative readiness (pull + support), Burden pressure (push with partial support offset), Transition trust (trust with support).',
    'Alternative readiness (pull + support), Burden pressure (push với phần bù từ support), Transition trust (trust đi cùng support).'
  ],
  ['For scenario comparison only; not a direct adoption forecast.', 'Chỉ dùng để so sánh kịch bản; không phải dự báo adoption trực tiếp.'],
  ['Policy lever controls', 'Điều khiển policy lever'],
  ['Push intensity (restriction and cost)', 'Cường độ push (hạn chế và chi phí)'],
  ['Higher values represent stricter scope and higher burden from push-side policy terms.', 'Giá trị cao hơn thể hiện phạm vi siết chặt hơn và gánh nặng lớn hơn từ nhóm chính sách push.'],
  ['Pull quality (alternatives)', 'Chất lượng pull (phương án thay thế)'],
  [
    'The model identifies a strong status quo pull, large disutility for broad restrictions, and strong positive utility for pull and support attributes. Heterogeneity is consistent with dependence, income, trust, and environmental concern channels.',
    'Mô hình cho thấy lực kéo status quo mạnh, disutility lớn với hạn chế rộng, và utility dương rõ với các thuộc tính pull và support. Heterogeneity nhất quán với các kênh phụ thuộc, thu nhập, trust và environmental concern.'
  ],
  [
    'This module converts estimated coefficients into scenario comparisons. It is a communication tool, not a demand forecast. In this index, push has a negative sign, while pull, support, and trust have positive signs.',
    'Module này chuyển hệ số ước tính thành so sánh kịch bản. Đây là công cụ truyền thông, không phải forecast nhu cầu. Trong index này, push mang dấu âm, còn pull, support và trust mang dấu dương.'
  ],
  [
    'The managerial implication is sequencing discipline. Restriction scale-up should follow measurable readiness, support reach, and trust conditions.',
    'Hàm ý quản trị nằm ở sequencing discipline. Việc mở rộng hạn chế nên đi sau mức readiness đo được, độ phủ support và điều kiện trust.'
  ],
  [
    'Prioritize frequent and reliable public transport, fare relief, and usable interchange capacity before tightening restriction scope. This aligns with positive pull coefficients and high WTP for quality improvements.',
    'Ưu tiên giao thông công cộng thường xuyên và đáng tin, hỗ trợ giá vé và interchange capacity dùng được trước khi siết phạm vi hạn chế. Điều này khớp với hệ số pull dương và WTP cao cho cải thiện chất lượng.'
  ],
  [
    'Protect dependence-heavy and lower-income groups with e-motorcycle grants and transition subsidies. Interaction terms indicate that dependence strengthens ban opposition and income changes cost and grant valuation.',
    'Bảo vệ nhóm phụ thuộc nhiều và thu nhập thấp bằng hỗ trợ mua e-motorcycle và transition subsidy. Interaction term cho thấy mức phụ thuộc làm tăng phản đối lệnh cấm, còn thu nhập thay đổi độ nhạy chi phí và valuation với khoản hỗ trợ.'
  ],
  [
    'Use transparent revenue recycling and public oversight communication. Trust reduces status-quo pull, so implementation credibility is not supplementary; it is part of acceptance design.',
    'Dùng cơ chế tái sử dụng nguồn thu minh bạch và truyền thông giám sát công khai. Trust làm giảm lực kéo status quo, nên credibility khi triển khai không phải phần phụ; nó là một phần của acceptance design.'
  ],
  ['Readiness gate', 'Mốc readiness'],
  ['Transit frequency, reliability, and corridor coverage meet threshold.', 'Tần suất, độ tin cậy và độ phủ hành lang transit đạt ngưỡng.'],
  ['Support reach gate', 'Mốc độ phủ support'],
  ['Grant and subsidy access reaches exposure-heavy households.', 'Hộ chịu tác động cao tiếp cận được grant và subsidy.'],
  ['Trust and compliance gate', 'Mốc trust và compliance'],
  ['Complaint intensity and enforcement disputes remain stable.', 'Cường độ complaint và tranh chấp enforcement giữ ổn định.'],
  ['Outcome gate', 'Mốc outcome'],
  ['Air quality and social burden indicators improve together.', 'Chỉ số chất lượng không khí và gánh nặng xã hội cùng cải thiện.'],
  ['Source and image attribution', 'Nguồn và ghi nhận hình ảnh'],
  [
    'Phase-out acceptance is framed through pull/support-first sequencing before broad restrictions. Policy-choice framing in Hanoi transition context.',
    'Mức chấp nhận phase-out được đọc qua sequencing ưu tiên pull/support trước khi áp dụng hạn chế rộng. Đây là framing policy-choice trong bối cảnh chuyển đổi tại Hà Nội.'
  ],
  [
    'Legacy alias page for Legacy Alias: Hanoi Phase-Out. Search engines should use the canonical research page instead.',
    'Trang alias cũ cho Hanoi Phase-Out. Search engine nên dùng trang nghiên cứu canonical thay thế.'
  ],

  [
    'Hotel Attribute Asymmetry in Vietnam (PRCA + Kano) | Chung Hy Dai',
    'Bất đối xứng thuộc tính khách sạn tại Việt Nam (PRCA + Kano) | Chung Hy Dai'
  ],
  [
    'From 97,014 Booking.com Vietnam reviews, this PRCA + Kano page shows which service issues hurt ratings most and which upgrades help only after basics are stable.',
    'Từ 97.014 review Booking.com tại Việt Nam, trang PRCA + Kano này cho thấy vấn đề dịch vụ nào làm giảm rating mạnh nhất và nâng cấp nào chỉ hữu ích sau khi basics đã ổn định.'
  ],
  ['PRCA + Kano evidence summary', 'Tóm tắt bằng chứng PRCA + Kano'],
  ['Priority sequencing summary', 'Tóm tắt thứ tự ưu tiên'],
  ['Illustrative hotel context image for service-environment framing.', 'Ảnh minh họa bối cảnh khách sạn cho cách đọc service environment.'],
  ['Service Prioritization Sequence', 'Thứ tự ưu tiên dịch vụ'],
  ['Reported evidence logic', 'Logic từ bằng chứng đã báo cáo'],
  ['Service prioritization stages', 'Các bước ưu tiên dịch vụ'],
  ['1. Protect Basics', '1. Giữ vững các yếu tố nền tảng'],
  ['Fix must-not-fail issues first: cleanliness and WiFi.', 'Xử lý trước các lỗi không được phép lặp lại: cleanliness và WiFi.'],
  ['2. Scale Performance', '2. Chuẩn hóa nhóm Performance'],
  ['Improve core service drivers next: staff, room, value, and location.', 'Sau đó cải thiện các driver cốt lõi: staff, room, value và location.'],
  ['3. Stage Delighters', '3. Đầu tư Delighters đúng thời điểm'],
  ['Invest in extras last: facilities and food once basics are reliable.', 'Đầu tư extras sau cùng: facilities và food khi basics đã ổn định.'],
  ['Failure sensitivity', 'Độ nhạy khi dịch vụ lỗi'],
  ['High', 'Cao'],
  ['Upside leverage', 'Đòn bẩy upside'],
  ['Moderate', 'Vừa phải'],
  ['Model robustness', 'Độ chắc của mô hình'],
  ['Reported fit', 'Fit đã báo cáo'],
  ['Core Findings', 'Phát hiện chính'],
  ['PRCA asymmetry summary', 'Tóm tắt bất đối xứng PRCA'],
  ['means score loss when an attribute fails. In this study, penalties are stronger than rewards.', ' nghĩa là điểm bị mất khi một thuộc tính thất bại. Trong nghiên cứu này, penalty mạnh hơn reward.'],
  ['Cleanliness is the top must-not-fail factor.', 'Cleanliness là yếu tố không được phép fail quan trọng nhất.'],
  ['Staff service is the strongest upside lever when executed well (+0.680 reward coefficient).', 'Staff service là đòn bẩy upside mạnh nhất khi vận hành tốt (+0.680 reward coefficient).'],
  ['Attribute types: 2 Basics, 4 Performance drivers, 2 Delighters.', 'Nhóm thuộc tính: 2 Basics, 4 Performance drivers, 2 Delighters.'],
  [
    'Basic attributes create strong downside risk when they fail. Performance attributes have two-sided effects. Excitement attributes support differentiation after operational basics are stable.',
    'Basic attribute tạo downside risk lớn khi thất bại. Performance attribute có tác động hai chiều. Excitement attribute hỗ trợ khác biệt hóa sau khi basics vận hành đã ổn định.'
  ],
  ['Class definitions:', 'Định nghĩa nhóm:'],
  ['Source note:', 'Ghi chú nguồn:'],
  ['coefficients and class assignment are reported outputs from Paper 67 visualized in this page.', ' hệ số và cách gán nhóm là output đã report từ Paper 67, được trực quan hóa trên trang này.'],
  ['Core Metrics', 'Chỉ số chính'],
  ['Key model statistics', 'Thống kê chính của mô hình'],
  ['Sample size', 'Cỡ mẫu'],
  ['Approx. hotels', 'Số khách sạn xấp xỉ'],
  ['Average guest score', 'Điểm khách trung bình'],
  ['Share of perfect 10 scores', 'Tỷ lệ điểm 10 tuyệt đối'],
  ['Model explanatory power', 'Độ giải thích của mô hình'],
  ['Uncertainty check', 'Kiểm tra bất định'],
  ['Robust standard errors (HC1)', 'Robust standard errors (HC1)'],
  ['Attribute type split', 'Phân bổ nhóm thuộc tính'],
  ['Strongest upside driver', 'Driver upside mạnh nhất'],
  ['Illustrative Context', 'Bối cảnh minh họa'],
  ['Hotel characteristics mapped from Paper 67', 'Đặc điểm khách sạn được map từ Paper 67'],
  [
    'This illustrative map links the eight modeled attributes to concrete hotel characteristics described in Paper 67. It supplements, and does not replace, reported coefficients.',
    'Bản đồ minh họa này nối tám thuộc tính trong mô hình với đặc điểm khách sạn cụ thể được mô tả trong Paper 67. Nó bổ sung, không thay thế, các hệ số đã report.'
  ],
  ['Characteristic map of the eight Paper 67 attributes by Basic, Performance, and Excitement classes.', 'Bản đồ đặc điểm của tám thuộc tính trong Paper 67 theo nhóm Basic, Performance và Excitement.'],
  ['Visualization', 'Trực quan hóa'],
  ['Reported Coefficient Visuals', 'Trực quan hóa hệ số đã báo cáo'],
  [
    'Left chart reports penalty and reward effect sizes by attribute. Right chart reports the asymmetry class map used for service sequencing.',
    'Biểu đồ bên trái trình bày effect size penalty và reward theo từng thuộc tính. Biểu đồ bên phải trình bày bản đồ nhóm bất đối xứng dùng để sắp thứ tự ưu tiên dịch vụ.'
  ],
  ['Penalty (left) and reward (right) coefficients by attribute; larger absolute values indicate stronger score influence.', 'Hệ số penalty (trái) và reward (phải) theo thuộc tính; trị tuyệt đối càng lớn thì ảnh hưởng đến điểm càng mạnh.'],
  ['Asymmetry class map showing Basic, Performance, and Excitement zones.', 'Bản đồ nhóm bất đối xứng thể hiện các vùng Basic, Performance và Excitement.'],
  ['Method in Plain Steps', 'Phương pháp theo các bước dễ đọc'],
  ['How the analysis was built', 'Phân tích được xây dựng như thế nào'],
  ['Method execution steps', 'Các bước thực hiện phương pháp'],
  ['Data collection', 'Thu thập dữ liệu'],
  ['Collected Booking.com reviews and removed duplicates, resulting in 97,014 usable records.', 'Thu thập review Booking.com và loại trùng, còn 97.014 record dùng được.'],
  ['Language standardization', 'Chuẩn hóa ngôn ngữ'],
  ['Used NLLB-200 to translate and standardize multilingual reviews into one analysis-ready format.', 'Dùng NLLB-200 để dịch và chuẩn hóa review đa ngôn ngữ về một định dạng sẵn sàng phân tích.'],
  ['Attribute mapping', 'Map thuộc tính'],
  ['Used Sentence-BERT to map text into 8 service attributes (reported proxy precision up to 0.92).', 'Dùng Sentence-BERT để map text vào 8 thuộc tính dịch vụ (proxy precision được báo cáo lên đến 0.92).'],
  ['Polarity construction', 'Tạo polarity'],
  ['Separated positive and negative statements to estimate gains and losses independently.', 'Tách phát biểu tích cực và tiêu cực để ước tính gain và loss độc lập.'],
  ['PRCA + Kano classification', 'Phân loại PRCA + Kano'],
  ['Estimated penalty/reward effects with robust regression, then grouped attributes into 2 Basics, 4 Performance drivers, and 2 Delighters.', 'Ước tính hiệu ứng penalty/reward bằng robust regression, rồi nhóm thuộc tính thành 2 Basics, 4 Performance drivers và 2 Delighters.'],
  ['Attribute Interpretation', 'Diễn giải thuộc tính'],
  ['Comprehensive Interpretation of Hotel Attributes', 'Diễn giải đầy đủ các thuộc tính khách sạn'],
  ['Decision Rules', 'Quy tắc quyết định'],
  ['Basic class: failure prevention first', 'Nhóm Basic: ưu tiên ngăn lỗi trước'],
  ['is the highest downside driver. Hygiene failures erase rating equity faster than upgrades can recover it.', ' là downside driver mạnh nhất. Lỗi vệ sinh làm mất rating equity nhanh hơn tốc độ các nâng cấp có thể bù lại.'],
  ['behaves as a strict hygiene factor: unreliable internet hurts scores and does not create upside when merely acceptable.', ' hoạt động như một hygiene factor nghiêm ngặt: internet không ổn định làm giảm điểm và không tạo upside nếu chỉ ở mức chấp nhận được.'],
  ['Performance class: optimize for consistency', 'Nhóm Performance: tối ưu sự ổn định'],
  ['is the strongest upside lever with substantial failure risk.', ' là upside lever mạnh nhất nhưng vẫn có rủi ro lớn khi vận hành lỗi.'],
  ['carries almost the same downside as Staff but lower upside, so execution quality must stay stable.', ' có downside gần như Staff nhưng upside thấp hơn, nên chất lượng thực thi cần ổn định.'],
  ['and', 'và'],
  ['are moderate levers that protect perceived fairness and convenience.', ' là các lever vừa phải giúp bảo vệ cảm nhận công bằng và tiện lợi.'],
  ['Excitement class: differentiate after stabilization', 'Nhóm Excitement: khác biệt hóa sau khi đã ổn định'],
  ['have low downside but strong upside.', ' có downside thấp nhưng upside mạnh.'],
  ['These attributes are useful for premium differentiation once basic reliability is already controlled.', 'Các thuộc tính này hữu ích cho khác biệt hóa premium sau khi độ tin cậy cơ bản đã được kiểm soát.'],
  ['Normalized penalty and reward intensity board across eight hotel attributes', 'Bảng chuẩn hóa cường độ penalty và reward trên tám thuộc tính khách sạn'],
  ['If Extending the Research', 'Nếu phát triển nghiên cứu tiếp'],
  ['Ground-truth check for text labels', 'Kiểm tra ground truth cho text label'],
  ['Manually annotate a review subset for attribute and sentiment labels, then report precision/recall so the NLP mapping can be audited against human coding.', 'Annotate thủ công một tập review nhỏ cho attribute và sentiment label, rồi báo cáo precision/recall để kiểm toán NLP mapping với human coding.'],
  ['Quarterly re-estimation', 'Ước tính lại theo quý'],
  ['Re-estimate PRCA by quarter (or rolling windows) to verify whether class assignments stay stable across seasonality and market shifts.', 'Ước tính lại PRCA theo quý (hoặc rolling window) để kiểm tra việc gán nhóm có ổn định qua mùa vụ và biến động thị trường hay không.'],
  ['Replication in another destination', 'Replication ở một điểm đến khác'],
  ['Run the same pipeline in at least one comparable city using the same preprocessing and model settings to test transferability.', 'Chạy cùng pipeline ở ít nhất một thành phố tương đồng, dùng cùng preprocessing và model setting để kiểm tra transferability.'],
  ['Action-to-outcome linkage', 'Nối action với outcome'],
  ['Track intervention dates (e.g., housekeeping SOP changes, staff training) and compare before/after shifts in ratings and attribute mentions.', 'Theo dõi ngày can thiệp (ví dụ đổi SOP housekeeping, training staff) và so sánh thay đổi trước/sau về rating và lượt nhắc đến thuộc tính.'],
  ['Managerial Priority Order', 'Thứ tự ưu tiên quản trị'],
  ['Protect Basics', 'Giữ vững yếu tố nền tảng'],
  ['Stabilize high-penalty factors first.', 'Ổn định trước các yếu tố có penalty cao.'],
  ['Optimize Performance', 'Tối ưu nhóm Performance'],
  ['Improve staff, room, value, and location next.', 'Sau đó cải thiện staff, room, value và location.'],
  ['Differentiate with Delighters', 'Khác biệt hóa bằng Delighters'],
  ['Invest in facilities and food last.', 'Đầu tư facilities và food sau cùng.'],
  ['Coefficient format:', 'Cách đọc hệ số:'],
  ['penalty / reward. More negative penalty means stronger score damage when that attribute fails.', ' penalty / reward. Penalty càng âm nghĩa là điểm bị ảnh hưởng mạnh hơn khi thuộc tính đó thất bại.'],
  [
    'This panel translates the reported coefficients into operational meaning. Penalty bars show downside risk when performance fails; reward bars show upside potential when performance excels.',
    'Panel này chuyển các hệ số đã report thành ý nghĩa vận hành. Penalty bar thể hiện downside risk khi performance thất bại; reward bar thể hiện upside potential khi performance tốt.'
  ],
  [
    'Operational reading: set non-negotiable baseline controls before funding premium features.',
    'Cách đọc vận hành: thiết lập baseline control không thể thỏa hiệp trước khi đầu tư premium feature.'
  ],
  [
    'Operational reading: gate delighter investment behind stable Basic and Performance KPIs.',
    'Cách đọc vận hành: chỉ đầu tư delighter sau khi Basic và Performance KPI đã ổn định.'
  ],
  [
    'Treat cleanliness and WiFi as non-negotiables. Cleanliness has the steepest penalty (-1.500), and WiFi shows no real upside when only "acceptable" (-0.656 / -0.052).',
    'Xem cleanliness và WiFi là điều không thể thỏa hiệp. Cleanliness có penalty dốc nhất (-1.500), còn WiFi gần như không tạo upside khi chỉ ở mức "chấp nhận được" (-0.656 / -0.052).'
  ],
  [
    'After basics are stable, standardize staff and room delivery. Staff is the strongest upside lever (+0.680), while room quality still carries high downside risk (-0.967).',
    'Sau khi basics ổn định, chuẩn hóa staff và room delivery. Staff là upside lever mạnh nhất (+0.680), trong khi room quality vẫn có downside risk cao (-0.967).'
  ],
  [
    'Use food and facilities as targeted differentiators last. They carry lower penalty risk but strong reward potential (Food +0.525, Facilities +0.410).',
    'Dùng food và facilities như differentiator có mục tiêu ở bước cuối. Hai thuộc tính này có penalty risk thấp hơn nhưng reward potential mạnh (Food +0.525, Facilities +0.410).'
  ],
  [
    'Operational rule: protect basics every day, review penalty signals monthly, rerank priorities quarterly, and fund differentiating attributes only after basic complaints remain low.',
    'Quy tắc vận hành: bảo vệ basics hằng ngày, review penalty signal hằng tháng, xếp lại ưu tiên hằng quý, và chỉ đầu tư thuộc tính khác biệt hóa sau khi complaint về basics duy trì thấp.'
  ],
  [
    'PRCA and Kano analysis of 97,014 reviews identifies hotel attribute penalties, rewards, and basics. 97,014 reviews from approximately 1,000 Vietnam properties.',
    'Phân tích PRCA và Kano trên 97.014 review xác định penalty, reward và basic của các thuộc tính khách sạn. Dữ liệu gồm 97.014 review từ khoảng 1.000 cơ sở lưu trú tại Việt Nam.'
  ],

  [
    'Hotel Customer Segmentation from Aspect-Level Sentiment in Da Nang | Chung Hy Dai',
    'Phân khúc khách hàng khách sạn tại Đà Nẵng từ phân tích cảm xúc theo khía cạnh | Chung Hy Dai'
  ],
  [
    'Transforming 74,896 unstructured Booking.com reviews in Da Nang into an actionable 10-profile customer segmentation using aspect-based sentiment analysis.',
    'Chuyển 74.896 review Booking.com không cấu trúc tại Đà Nẵng thành 10 hồ sơ khách hàng có thể dùng ngay cho quyết định dịch vụ, bằng phân tích cảm xúc theo khía cạnh.'
  ],
  [
    'Aggregated ratings, such as "8.2/10", can hide operational differences. A cleanliness complaint from an older couple may reflect a different service priority than a solo traveler\'s focus on location. Hotel teams therefore require granular experience profiles.',
    'Rating tổng hợp như "8.2/10" có thể che mất khác biệt vận hành. Một complaint về cleanliness từ cặp đôi lớn tuổi có thể phản ánh ưu tiên dịch vụ khác với việc solo traveler chú ý đến location. Vì vậy đội khách sạn cần experience profile chi tiết hơn.'
  ],
  [
    'Aggregated scores mask the specific drivers of dissatisfaction among different guest segments, making prioritized operational changes impossible.',
    'Điểm tổng hợp che mất driver cụ thể của bất mãn giữa các guest segment, khiến việc ưu tiên thay đổi vận hành trở nên khó khả thi.'
  ],
  [
    'An NLP pipeline mapped aspect-level sentiment followed by validated clustering algorithms to group travelers based on shared concerns.',
    'Một quy trình NLP lập bản đồ cảm xúc theo khía cạnh, sau đó dùng thuật toán phân cụm đã kiểm tra để gom khách theo mối quan tâm chung.'
  ],
  [
    '10 distinct consumer profiles, allowing hoteliers to tailor their service interventions to the precise expectations of their most frequent guests.',
    '10 hồ sơ khách hàng riêng biệt, giúp đội ngũ khách sạn điều chỉnh hành động dịch vụ theo kỳ vọng cụ thể của từng nhóm khách thường gặp.'
  ],
  [
    'NLP models built on raw review text can identify service failures across different personas.',
    'Các mô hình NLP dựa trên review thô có thể xác định điểm đứt gãy dịch vụ giữa những nhóm khách khác nhau.'
  ],
  [
    'Aspect-level sentiment segmentation from 74,896 reviews to map 10 guest segments for hotel decision-making. 74,896 reviews across 458 Da Nang hotels.',
    'Phân tích cảm xúc theo khía cạnh trên 74.896 review để lập bản đồ 10 nhóm khách phục vụ quyết định khách sạn. Dữ liệu gồm 74.896 review từ 458 khách sạn tại Đà Nẵng.'
  ],
  [
    'Review text signals are translated into value-led hospitality segments. Framework explainer linked to Da Nang segmentation stream.',
    'Tín hiệu từ review text được chuyển thành các hospitality segment theo value. Đây là trang giải thích framework nối với luồng segmentation tại Đà Nẵng.'
  ],

  [
    'Student Diet Quality in Vietnam | Nutrition Knowledge and Physical Activity | Chung Hy Dai',
    'Student Diet Quality tại Việt Nam | Nutrition Knowledge và Physical Activity | Chung Hy Dai'
  ],
  [
    'This consumer insights study uses survey responses from 280 Vietnamese university students to identify modifiable drivers of diet quality and physical activity.',
    'Nghiên cứu consumer insights này dùng survey từ 280 sinh viên đại học tại Việt Nam để xác định các driver có thể tác động của diet quality và physical activity.'
  ],
  [
    'Universities struggle to design effective health interventions because they lack local evidence on what exactly shapes student diet quality and physical activity habits.',
    'Các trường đại học khó thiết kế health intervention hiệu quả khi thiếu bằng chứng local về yếu tố thật sự định hình diet quality và thói quen physical activity của sinh viên.'
  ],
  [
    'Global studies on student diets do not always translate to a Vietnamese university campus, so the analysis focuses on local evidence for health and food-service decisions.',
    'Nghiên cứu quốc tế về student diet không phải lúc nào cũng chuyển được vào campus đại học tại Việt Nam, nên phân tích tập trung vào bằng chứng local cho quyết định health và food-service.'
  ],
  [
    'Ran a structured survey across 280 valid respondents, using multivariable regression modeling and demographic controls.',
    'Triển khai structured survey với 280 phản hồi hợp lệ, dùng multivariable regression và demographic controls.'
  ],
  [
    'Identified direct links between nutrition knowledge, physical activity levels, and diet quality, which helps frame phased intervention priorities for campus dining.',
    'Xác định liên hệ trực tiếp giữa nutrition knowledge, mức physical activity và diet quality, giúp định khung ưu tiên intervention theo giai đoạn cho campus dining.'
  ],
  [
    'Meal choices on campus are often made under extreme time constraints and budget pressures.',
    'Lựa chọn bữa ăn trên campus thường diễn ra dưới áp lực thời gian và ngân sách rất rõ.'
  ],
  [
    'Students with elevated baseline nutrition knowledge are significantly more resilient to poor food environments.',
    'Sinh viên có baseline nutrition knowledge cao thường chống chịu tốt hơn trước môi trường thực phẩm kém.'
  ],
  [
    'Practical, visible defaults in dining areas—combined with integrated physical activity nudges—are the most efficient ways to elevate overall public health on campus.',
    'Default thực tế và dễ thấy trong khu ăn uống, kết hợp với physical activity nudge tích hợp, là cách hiệu quả để cải thiện sức khỏe chung trên campus.'
  ],
  [
    'Survey data from 280 Vietnamese university students links nutrition knowledge and physical activity to diet quality and intervention priorities. n = 280 students.',
    'Survey từ 280 sinh viên đại học tại Việt Nam nối nutrition knowledge và physical activity với diet quality và ưu tiên intervention. Mẫu n = 280 sinh viên.'
  ],

  [
    'Virtual Influencer Trust and Purchase Intention | Creator Economy Research | Chung Hy Dai',
    'Virtual Influencer Trust và Purchase Intention | Nghiên cứu Creator Economy | Chung Hy Dai'
  ],
  [
    'This consumer insights study explores how virtual influencer cues shape Generation Z trust, credibility, and purchase intention.',
    'Nghiên cứu consumer insights này tìm hiểu cách virtual influencer cue định hình trust, credibility và purchase intention của Gen Z.'
  ],
  [
    'With the rise of VTubers and photorealistic CGI models, brands required clearer evidence on what makes a virtual influencer persuasive to a Gen Z audience.',
    'Khi VTuber và model CGI photorealistic phát triển, brand cần bằng chứng rõ hơn về điều khiến virtual influencer thuyết phục với audience Gen Z.'
  ],
  [
    'Are virtual influencers effective because of novelty, or are there deeper trust levers at play? Marketers lacked evidence on the boundary limits.',
    'Virtual influencer hiệu quả vì novelty, hay vì các trust lever sâu hơn? Marketer thiếu bằng chứng về boundary limit của hiệu ứng này.'
  ],
  [
    'Constructed a survey model testing direct and mediated relationships based on simulated Instagram scenarios.',
    'Xây dựng survey model để kiểm tra quan hệ trực tiếp và mediated dựa trên kịch bản Instagram mô phỏng.'
  ],
  [
    'Speciesism acts as a moderator. Credibility and argument quality outrank pure aesthetic novelty in this Gen Z purchase-intention study.',
    'Speciesism đóng vai trò moderator. Trong nghiên cứu purchase intention của Gen Z này, credibility và argument quality quan trọng hơn novelty thẩm mỹ thuần túy.'
  ],
  [
    'We built 4 different Instagram interface mockups to test high vs. low argument quality combined with high vs. low aesthetics.',
    'Nghiên cứu dựng 4 mockup giao diện Instagram để test argument quality cao/thấp kết hợp với aesthetics cao/thấp.'
  ],
  [
    'Pretty visuals (peripheral cues) cannot save a bad product pitch (central cue). Gen Z fundamentally evaluates digital entities functionally.',
    'Visual đẹp (peripheral cue) không cứu được product pitch yếu (central cue). Gen Z về cơ bản vẫn đánh giá digital entity theo chức năng.'
  ],
  [
    'If a user possesses high "speciesism" (bias against robots/AI), the virtual influencer\'s impact hits a strict upper ceiling.',
    'Nếu người dùng có "speciesism" cao, tức bias với robot/AI, tác động của virtual influencer sẽ gặp trần rất rõ.'
  ],
  [
    'Consumer insights and creator-economy research on virtual influencer cues, Gen Z trust, and purchase intention through credibility, relevance, and disclosure guardrails..',
    'Nghiên cứu consumer insights và creator economy về virtual influencer cue, trust của Gen Z và purchase intention thông qua credibility, relevance và disclosure guardrail.'
  ],

  [
    'Buffet Menu Nudging and Choice Architecture | Chung Hy Dai',
    'Menu Nudging trong buffet và Choice Architecture | Chung Hy Dai'
  ],
  [
    'This study tests whether re-ordering menu information can reduce buffet plate-waste risk without forcing choice removal. Two Vietnamese online experiments compare healthier-options-first (HOF) versus unhealthier-options-first (UOF) menu sequencing across buffet formats and tiered-price contexts.',
    'Nghiên cứu kiểm tra liệu việc sắp lại thông tin menu có thể giảm rủi ro plate waste trong buffet mà không cần loại bỏ lựa chọn hay không. Hai online experiment tại Việt Nam so sánh menu sequencing healthier-options-first (HOF) và unhealthier-options-first (UOF) trên nhiều format buffet và bối cảnh tiered price.'
  ],
  [
    'Most restaurant food-waste interventions emphasize back-of-house controls, but plate waste is a customer-side behavior problem. Food-service contributes a meaningful share of consumer-level waste, and buffet formats are especially exposed because fixed pricing, visual abundance, and value-seeking behavior can push guests toward higher-calorie and higher-volume selection.',
    'Nhiều food-waste intervention trong nhà hàng tập trung vào back-of-house, nhưng plate waste là vấn đề hành vi từ phía khách. Food-service đóng góp đáng kể vào waste ở cấp consumer, và buffet đặc biệt nhạy vì fixed pricing, cảm giác abundance và hành vi tìm kiếm value có thể đẩy khách chọn nhiều món và nhiều calorie hơn.'
  ],
  [
    'This research addresses a practical managerial gap: can a low-cost, non-restrictive menu-order intervention reduce plate-waste risk while preserving perceived value and premium-tier demand?',
    'Nghiên cứu xử lý một managerial gap thực tế: liệu một menu-order intervention chi phí thấp, không hạn chế lựa chọn, có thể giảm rủi ro plate waste trong khi vẫn giữ perceived value và premium-tier demand hay không?'
  ],
  [
    'The two-way ANOVA supported H1: menu-order effects depended on buffet type. HOF delivered the strongest reduction in hotpot and Korean contexts, while vegetarian menus showed almost no calorie difference between orders.',
    'Two-way ANOVA ủng hộ H1: hiệu ứng menu order phụ thuộc vào loại buffet. HOF giảm mạnh nhất trong bối cảnh hotpot và Korean, trong khi menu vegetarian gần như không khác biệt calorie giữa các thứ tự.'
  ],
  [
    'The intervention changes intended behavior but introduces an economic trade-off when premium cues are weakened.',
    'Intervention thay đổi intended behavior nhưng tạo trade-off kinh tế khi premium cue bị yếu đi.'
  ],
  [
    'Menu order functions as a soft default. HOF can reduce high-calorie intended choices in indulgent buffet formats without banning options. This confirms choice-architecture mechanisms such as primacy and salience ordering.',
    'Menu order hoạt động như một soft default. HOF có thể giảm lựa chọn intended calorie cao trong các format buffet indulgent mà không cần cấm lựa chọn. Điều này củng cố cơ chế choice architecture như primacy và salience ordering.'
  ],
  [
    'However, the same intervention can lower perceived value in contexts where diners treat visible meat abundance as the signal of worth. In tiered pricing, that perception channel can reduce premium conversion and pressure revenue-per-guest.',
    'Tuy vậy, cùng intervention có thể làm giảm perceived value trong bối cảnh khách xem sự phong phú của thịt như tín hiệu của giá trị. Với tiered pricing, kênh cảm nhận này có thể giảm premium conversion và tạo áp lực lên revenue-per-guest.'
  ],
  [
    'Healthier-first menu sequencing reduced intended calories and shifted choice toward lower-priced buffet bundles. Study 1 n=257; Study 2 n=147 (Vietnamese diners).',
    'Menu sequencing kiểu healthier-first làm giảm intended calories và dịch chuyển lựa chọn sang buffet bundle giá thấp hơn. Study 1 n=257; Study 2 n=147 với diner tại Việt Nam.'
  ],

  [
    'Influencer Retention, Engagement, and Brand Transfer on UGC Platforms | Chung Hy Dai',
    'Influencer Retention, Engagement và Brand Transfer trên nền tảng UGC | Chung Hy Dai'
  ],
  [
    'This manuscript-aligned page summarizes a UGC influencer study in Vietnam using the Four-E construct logic (CX, CEX, BE, CE) and split-sample validation. The model is estimated with EFA and CFA/SEM (overall n = 565; EFA n = 200; CFA/SEM n = 365), with retention explained primarily through engagement quality.',
    'Trang này tóm tắt nghiên cứu UGC influencer tại Việt Nam theo logic construct Four-E (CX, CEX, BE, CE) và split-sample validation. Mô hình dùng EFA và CFA/SEM (overall n = 565; EFA n = 200; CFA/SEM n = 365), trong đó retention được giải thích chủ yếu qua engagement quality.'
  ],
  [
    'Influencer campaigns on UGC platforms often optimize reach metrics before clarifying how trust, experience, and expectation matching translate into retention. The study addresses this gap by testing a structured Four-E logic and by positioning engagement quality as the central bridge between exposure and return behavior.',
    'Influencer campaign trên nền tảng UGC thường tối ưu reach metric trước khi làm rõ trust, experience và expectation matching chuyển thành retention như thế nào. Nghiên cứu xử lý khoảng trống này bằng cách test logic Four-E có cấu trúc và đặt engagement quality làm cầu nối chính giữa exposure và return behavior.'
  ],
  [
    'The method follows a cross-sectional online survey protocol with split-sample construct validation and structural testing. The workflow keeps exploration and confirmation separate, then estimates path and mediation logic using SEM.',
    'Phương pháp theo protocol cross-sectional online survey với split-sample construct validation và structural testing. Workflow tách exploration khỏi confirmation, rồi ước tính path và mediation logic bằng SEM.'
  ],
  [
    'Managerial recommendations are derived from reported model logic and constrained qualitative inference. The main implication is to build campaign sequencing around engagement quality as the operational bridge to retention.',
    'Khuyến nghị quản trị được suy ra từ logic mô hình đã report và qualitative inference có giới hạn. Hàm ý chính là xây campaign sequencing quanh engagement quality như cầu nối vận hành đến retention.'
  ],
  [
    'The visual package combines reported structure with explicit qualitative inference to improve managerial readability. Exact public coefficient tables are not visible in the available screenshot source archive, so this page does not claim numeric path coefficients or p-values.',
    'Bộ hình kết hợp cấu trúc đã report với qualitative inference được ghi rõ để dễ đọc cho quản trị. Bảng hệ số public chi tiết không thấy trong archive screenshot hiện có, nên trang này không claim path coefficient hoặc p-value cụ thể.'
  ],
  [
    'Four-E UGC retention model linking engagement quality, brand equity, and return intent. n = 565 active UGC users in Vietnam.',
    'Mô hình Four-E về UGC retention nối engagement quality, brand equity và return intent. Mẫu n = 565 active UGC users tại Việt Nam.'
  ],

  [
    'Psychological Ownership in Vietnam Universities | Chung Hy Dai',
    'Psychological Ownership trong đại học Việt Nam | Chung Hy Dai'
  ],
  [
    'In simple terms, psychological ownership is the feeling that something is "mine" or "ours" even without legal ownership. This page translates that idea into practical choices for Vietnamese universities across faculty, staff, and student teams.',
    'Nói đơn giản, psychological ownership là cảm giác một điều gì đó là "của mình" hoặc "của chúng ta" dù không có quyền sở hữu pháp lý. Trang này chuyển ý tưởng đó thành lựa chọn thực tế cho đại học Việt Nam ở faculty, staff và student teams.'
  ],
  [
    'Psychological ownership is a feeling, not a legal contract. People feel ownership when they can shape work, understand it deeply, and see it as part of who they are. In Vietnamese universities, this can appear in course design, service processes, and student-led teamwork.',
    'Psychological ownership là cảm giác, không phải hợp đồng pháp lý. Con người cảm thấy ownership khi họ có thể định hình công việc, hiểu sâu về nó và xem nó là một phần của mình. Trong đại học Việt Nam, điều này có thể xuất hiện trong course design, service process và teamwork do sinh viên dẫn dắt.'
  ],
  [
    'Prior studies support the ownership-commitment link. However, UEH model outputs (sample, fit, and coefficients) are not publicly available, so UEH-specific effect sizes are still unconfirmed. For Vietnamese universities, this means the mechanism is transferable, but local effect size claims are not yet verifiable.',
    'Các nghiên cứu trước ủng hộ liên hệ ownership-commitment. Tuy nhiên, output mô hình UEH (sample, fit và coefficients) chưa công khai, nên effect size riêng cho UEH vẫn chưa xác nhận. Với đại học Việt Nam, điều này nghĩa là cơ chế có thể chuyển giao, nhưng claim về local effect size chưa thể kiểm chứng.'
  ],
  [
    'Vietnamese universities operate through interdependent academic, administrative, and student systems. Ownership research helps identify where commitment weakens and how practical intervention choices can be staged.',
    'Đại học Việt Nam vận hành qua các hệ thống học thuật, hành chính và sinh viên có phụ thuộc lẫn nhau. Nghiên cứu ownership giúp xác định commitment yếu ở đâu và intervention thực tế nên triển khai theo giai đoạn như thế nào.'
  ],
  [
    'When faculties and offices run in silos, people may protect tasks but not shared outcomes. Ownership framing clarifies who owns cross-unit delivery, not only isolated duties.',
    'Khi faculty và office vận hành theo silo, con người có thể bảo vệ task riêng nhưng không bảo vệ outcome chung. Ownership framing làm rõ ai sở hữu delivery liên đơn vị, không chỉ duty rời rạc.'
  ],
  [
    'Student experience relies on many handoffs: advising, timetables, finance, and classroom delivery. Weak "ours" ownership across these points can reduce service consistency.',
    'Student experience phụ thuộc vào nhiều handoff: advising, timetable, finance và classroom delivery. Ownership kiểu "ours" yếu giữa các điểm này có thể làm giảm service consistency.'
  ],
  [
    'Improvement initiatives can become person-dependent when ownership is weak. Building stronger "mine" ownership in role design improves follow-through beyond individual hero effort.',
    'Improvement initiative dễ phụ thuộc vào cá nhân khi ownership yếu. Xây "mine" ownership mạnh hơn trong role design giúp follow-through tốt hơn, không dựa vào nỗ lực anh hùng cá nhân.'
  ],
  [
    'Project courses and student clubs perform better when participants own both personal contribution and shared outcomes. This is a direct campus pathway for applying ownership theory.',
    'Project course và student club vận hành tốt hơn khi participant sở hữu cả đóng góp cá nhân lẫn outcome chung. Đây là tuyến ứng dụng trực tiếp của ownership theory trên campus.'
  ],
  [
    'Ownership evidence is translated into practical commitment actions for Vietnam university teams. SEM fit/sample not publicly provided in current sources.',
    'Bằng chứng về ownership được chuyển thành hành động thực tế để xây commitment cho team trong đại học Việt Nam. Fit/sample SEM chưa được công bố trong nguồn hiện có.'
  ],

  [
    'Arts Workshop Co-creation and Customer Interest | Chung Hy Dai',
    'Co-creation trong workshop nghệ thuật và Customer Interest | Chung Hy Dai'
  ],
  [
    'This page has been expanded to reflect the full research narrative: theoretical framing, hypothesis development, methodology, reliability and structural results, mediation mechanisms, and implications for hybrid participatory art venues.',
    'Trang này đã được mở rộng để phản ánh đầy đủ narrative nghiên cứu: theoretical framing, phát triển hypothesis, methodology, reliability và structural results, mediation mechanism, cùng hàm ý cho hybrid participatory art venues.'
  ],
  [
    'This study examines Ladder Art Space participation using Consumption Values and Service-Dominant Logic. SEM results from 216 responses show full mediation: values shape participation intention through attitude, not through direct effects.',
    'Nghiên cứu xem xét participation tại Ladder Art Space bằng Consumption Values và Service-Dominant Logic. Kết quả SEM từ 216 phản hồi cho thấy full mediation: values định hình participation intention qua attitude, không phải qua direct effect.'
  ],
  [
    'Epistemic value is the strongest attitude driver, and the model explains 57.1% of attitude variance and 35.2% of intention variance. Practical priority: position workshops around learning confidence and supportive social settings.',
    'Epistemic value là driver mạnh nhất của attitude, và mô hình giải thích 57,1% variance của attitude và 35,2% variance của intention. Ưu tiên thực tế: position workshop quanh learning confidence và social setting có tính hỗ trợ.'
  ],
  [
    'Quantitative cross-sectional survey administered through Google Forms to respondents in Australian art/creative communities. Screening rules excluded inattentive responses (attention-check failure) and speeders (&lt; 4 minutes).',
    'Khảo sát quantitative cross-sectional triển khai qua Google Forms với người trả lời trong cộng đồng art/creative tại Australia. Screening rule loại phản hồi thiếu chú ý và phản hồi quá nhanh (&lt; 4 phút).'
  ],
  [
    'Reliability is acceptable across constructs; convergent validity is mixed because several AVE values are below 0.50, so interpretation should be paired with additional validity evidence.',
    'Reliability ở mức chấp nhận được giữa các construct; convergent validity còn mixed vì một số AVE dưới 0,50, nên phần diễn giải cần đi cùng bằng chứng validity bổ sung.'
  ],
  [
    'hybrid art consumers are not primarily seeking passive enjoyment. They seek productive leisure with learning, confidence, and social connection. Participation occurs when value perceptions are translated into a positive attitude toward the workshop experience.',
    'Hybrid art consumer không chủ yếu tìm passive enjoyment. Họ tìm productive leisure với learning, confidence và social connection. Participation xảy ra khi value perception được chuyển thành attitude tích cực với workshop experience.'
  ],
  [
    'Emotional, social, and learning cues are sequenced to support repeat arts workshop participation. SEM fit/sample not publicly provided in current sources.',
    'Các cue về emotional, social và learning được sắp theo sequence để hỗ trợ repeat participation trong arts workshop. Fit/sample SEM chưa được công bố trong nguồn hiện có.'
  ],

  [
    'Browse the main portfolio paths',
    'Xem các tuyến chính của portfolio'
  ],
  [
    'Use these direct links to move between the profile page, the archive, and research clusters without depending on one header route.',
    'Dùng các link trực tiếp này để chuyển giữa trang hồ sơ, archive và các cụm nghiên cứu mà không phụ thuộc vào một tuyến header duy nhất.'
  ],
  [
    'Use these direct links to move between the profile page, the archive, and the research clusters without depending on one header route.',
    'Dùng các link trực tiếp này để chuyển giữa trang hồ sơ, archive và các cụm nghiên cứu mà không phụ thuộc vào một tuyến header duy nhất.'
  ],
  [
    'Use these links to move between connected studies instead of landing on a single isolated case page.',
    'Dùng các link này để chuyển giữa các nghiên cứu liên quan, thay vì dừng ở một trang case riêng lẻ.'
  ],
  [
    'Browse the Mobility and Policy Research topic page',
    'Xem trang topic Mobility and Policy Research'
  ],
  [
    'Browse the Health and Behavior Research topic page',
    'Xem trang topic Health and Behavior Research'
  ],
  [
    'About Chung Hy Dai and research methodology',
    'Giới thiệu Chung Hy Dai và phương pháp nghiên cứu'
  ],
  [
    'Verified profile signals and credentials',
    'Tín hiệu hồ sơ và chứng chỉ'
  ],
  [
    'Short research insights',
    'Insight nghiên cứu ngắn'
  ],
  [
    'Explore adjacent research paths',
    'Xem các hướng nghiên cứu liên quan'
  ],
  [
    'View the Mobility and Policy Research topic page',
    'Xem trang topic Mobility and Policy Research'
  ],
  [
    'View the Health and Behavior Research topic page',
    'Xem trang topic Health and Behavior Research'
  ]
];

for (const [source, translation] of VI_COPY_TRANSLATIONS) {
  EXACT_TEXT.set(source, translation);
}

const PHRASE_REPLACEMENTS = [
  [/market research and consumer insights/gi, 'nghiên cứu thị trường và thấu hiểu người tiêu dùng'],
  [/market research/gi, 'nghiên cứu thị trường'],
  [/consumer insights/gi, 'thấu hiểu người tiêu dùng'],
  [/analyst/gi, 'chuyên viên phân tích'],
  [/insight reporting/gi, 'báo cáo insight'],
  [/insights?/gi, 'insight'],
  [/\band\b/gi, 'và'],
  [/AI-assisted exploratory analysis/gi, 'phân tích khám phá có hỗ trợ AI'],
  [/AI-assisted exploration/gi, 'khám phá dữ liệu có hỗ trợ AI'],
  [/AI-assisted analysis/gi, 'phân tích có hỗ trợ AI'],
  [/AI-supported insights/gi, 'phát hiện có hỗ trợ AI'],
  [/applied analytics/gi, 'phân tích ứng dụng'],
  [/analytics visual/gi, 'hình ảnh phân tích'],
  [/analytics/gi, 'phân tích'],
  [/editorial/gi, 'hình ảnh'],
  [/visuals?/gi, 'hình ảnh'],
  [/dashboard/gi, 'bảng thông tin'],
  [/research reporting/gi, 'báo cáo nghiên cứu'],
  [/data storytelling/gi, 'kể chuyện bằng dữ liệu'],
  [/survey analysis/gi, 'phân tích khảo sát'],
  [/business evidence/gi, 'bằng chứng kinh doanh'],
  [/projects?/gi, 'dự án'],
  [/executive summaries/gi, 'tóm tắt điều hành'],
  [/decision-ready outputs/gi, 'đầu ra rõ để hỗ trợ quyết định'],
  [/decision-ready business evidence/gi, 'bằng chứng kinh doanh đủ rõ để hỗ trợ quyết định'],
  [/hospitality segmentation/gi, 'phân khúc ngành lưu trú'],
  [/EV choice/gi, 'lựa chọn xe điện'],
  [/\bEV\b/gi, 'xe điện'],
  [/policy acceptance/gi, 'mức chấp nhận chính sách'],
  [/creator-economy/gi, 'kinh tế nhà sáng tạo nội dung'],
  [/creator economy/gi, 'kinh tế nhà sáng tạo nội dung'],
  [/creator strategy/gi, 'chiến lược nhà sáng tạo nội dung'],
  [/creator framing/gi, 'cách đóng khung nhà sáng tạo nội dung'],
  [/creator/gi, 'nhà sáng tạo nội dung'],
  [/behavior research/gi, 'nghiên cứu hành vi'],
  [/service quality/gi, 'chất lượng dịch vụ'],
  [/brand equity/gi, 'giá trị thương hiệu'],
  [/audience trust/gi, 'niềm tin của người xem'],
  [/audience/gi, 'người xem'],
  [/platforms?/gi, 'nền tảng'],
  [/digital personas/gi, 'nhân vật số'],
  [/digital persona/gi, 'nhân vật số'],
  [/buying intent/gi, 'ý định mua'],
  [/research portfolio/gi, 'portfolio nghiên cứu'],
  [/case-study/gi, 'nghiên cứu tình huống'],
  [/case study/gi, 'nghiên cứu tình huống'],
  [/case studies/gi, 'các nghiên cứu tình huống'],
  [/case pages/gi, 'trang nghiên cứu'],
  [/source notes/gi, 'ghi chú nguồn'],
  [/publication outputs/gi, 'đầu ra công bố'],
  [/publication context/gi, 'bối cảnh công bố'],
  [/outputs?/gi, 'kết quả'],
  [/identity record/gi, 'hồ sơ nhận diện'],
  [/reviewers/gi, 'người xem xét'],
  [/decision-making/gi, 'ra quyết định'],
  [/decision value/gi, 'giá trị cho quyết định'],
  [/problem framing/gi, 'định khung vấn đề'],
  [/evidence standards/gi, 'chuẩn bằng chứng'],
  [/evidence signals/gi, 'tín hiệu bằng chứng'],
  [/verified/gi, 'đã xác thực'],
  [/self-reported/gi, 'tự báo cáo'],
  [/derived/gi, 'suy luận từ dữ liệu'],
  [/conceptual/gi, 'khái niệm'],
  [/unverified/gi, 'chưa xác thực'],
  [/interview-defensible/gi, 'có thể bảo vệ khi phỏng vấn'],
  [/project structure/gi, 'cấu trúc dự án'],
  [/projects archive/gi, 'kho dự án'],
  [/topic hub/gi, 'cụm chủ đề'],
  [/topic page/gi, 'trang chủ đề'],
  [/domain clusters/gi, 'cụm mảng'],
  [/focus area/gi, 'mảng trọng tâm'],
  [/last updated/gi, 'cập nhật'],
  [/published/gi, 'đăng'],
  [/work authorization details available on request/gi, 'thông tin work authorization có thể trao đổi khi cần'],
  [/Vietnamese \(native\)/gi, 'Tiếng Việt (native)'],
  [/English \(IELTS Academic 6\.0\)/gi, 'Tiếng Anh (IELTS Academic 6.0)'],
  [/Swinburne University of Technology/gi, 'Swinburne University of Technology'],
  [/Swinburne Vietnam/gi, 'Swinburne Vietnam'],
  [/Ho Chi Minh City/gi, 'TP. Hồ Chí Minh'],
  [/Vietnam/gi, 'Việt Nam'],
  [/Hanoi/gi, 'Hà Nội'],
  [/Da Nang/gi, 'Đà Nẵng'],
  [/Generation Z/gi, 'Gen Z'],
  [/Gen Z/gi, 'Gen Z'],
  [/young Vietnamese consumers/gi, 'người tiêu dùng trẻ tại Việt Nam'],
  [/Vietnamese consumers/gi, 'người tiêu dùng Việt Nam'],
  [/Vietnamese university students/gi, 'sinh viên đại học tại Việt Nam'],
  [/student diet quality/gi, 'chất lượng ăn uống của sinh viên'],
  [/nutrition knowledge/gi, 'kiến thức dinh dưỡng'],
  [/physical activity/gi, 'hoạt động thể chất'],
  [/diet quality/gi, 'chất lượng ăn uống'],
  [/menu nudging/gi, 'gợi ý thứ tự thực đơn'],
  [/choice architecture/gi, 'kiến trúc lựa chọn'],
  [/choice modeling/gi, 'mô hình lựa chọn'],
  [/food-service/gi, 'dịch vụ ăn uống'],
  [/buffet/gi, 'buffet'],
  [/hotel reviews/gi, 'đánh giá khách sạn'],
  [/hotel value segmentation framework/gi, 'khung phân khúc giá trị khách sạn'],
  [/hotel value segmentation/gi, 'phân khúc giá trị khách sạn'],
  [/hotel customer segmentation/gi, 'phân khúc khách hàng khách sạn'],
  [/attribute asymmetry/gi, 'bất đối xứng thuộc tính'],
  [/value frameworks/gi, 'khung giá trị'],
  [/frameworks?/gi, 'khung phân tích'],
  [/guest segments/gi, 'nhóm khách'],
  [/guest expectations/gi, 'kỳ vọng của khách'],
  [/operational prioritization/gi, 'ưu tiên vận hành'],
  [/service teams/gi, 'đội ngũ dịch vụ'],
  [/reviews/gi, 'đánh giá'],
  [/rating/gi, 'điểm đánh giá'],
  [/intake/gi, 'lượng ăn dự kiến'],
  [/review text/gi, 'văn bản đánh giá'],
  [/text data/gi, 'dữ liệu văn bản'],
  [/aspect-level sentiment/gi, 'cảm xúc theo khía cạnh'],
  [/sentiment analysis/gi, 'phân tích cảm xúc'],
  [/clustering/gi, 'phân cụm'],
  [/Sentence-BERT/gi, 'Sentence-BERT'],
  [/PRCA\/Kano/gi, 'PRCA/Kano'],
  [/Kano/gi, 'Kano'],
  [/Discrete choice experiment/gi, 'thử nghiệm lựa chọn rời rạc'],
  [/discrete choice/gi, 'lựa chọn rời rạc'],
  [/mixed logit/gi, 'logit hỗn hợp'],
  [/willingness-to-pay/gi, 'mức sẵn sàng chi trả'],
  [/WTP/gi, 'WTP'],
  [/phase-out/gi, 'loại bỏ dần'],
  [/policy bundles/gi, 'gói chính sách'],
  [/transition policy/gi, 'chính sách chuyển đổi'],
  [/support sequencing/gi, 'thứ tự hỗ trợ'],
  [/pull-first/gi, 'ưu tiên tạo lựa chọn thay thế'],
  [/support-first/gi, 'ưu tiên hỗ trợ'],
  [/push-first/gi, 'ưu tiên hạn chế'],
  [/public transport/gi, 'giao thông công cộng'],
  [/fossil fuel vehicles/gi, 'phương tiện dùng nhiên liệu hóa thạch'],
  [/motorbike phase-out/gi, 'lộ trình loại bỏ dần xe máy'],
  [/restriction/gi, 'hạn chế'],
  [/restrictions/gi, 'hạn chế'],
  [/transition/gi, 'chuyển đổi'],
  [/acceptance/gi, 'mức chấp nhận'],
  [/UGC platforms/gi, 'nền tảng UGC'],
  [/UGC/gi, 'UGC'],
  [/virtual influencers/gi, 'nhân vật ảnh hưởng ảo'],
  [/virtual influencer/gi, 'nhân vật ảnh hưởng ảo'],
  [/influencer/gi, 'người ảnh hưởng'],
  [/purchase intention/gi, 'ý định mua'],
  [/trust cues/gi, 'tín hiệu niềm tin'],
  [/credibility/gi, 'độ tin cậy'],
  [/brand transfer/gi, 'chuyển giao giá trị thương hiệu'],
  [/retention/gi, 'khả năng quay lại'],
  [/engagement quality/gi, 'chất lượng gắn kết'],
  [/engagement/gi, 'mức gắn kết'],
  [/trust/gi, 'niềm tin'],
  [/cues/gi, 'tín hiệu'],
  [/cue/gi, 'tín hiệu'],
  [/structural equation/gi, 'phương trình cấu trúc'],
  [/SEM/gi, 'SEM'],
  [/EFA/gi, 'EFA'],
  [/CFA/gi, 'CFA'],
  [/psychological ownership/gi, 'cảm giác sở hữu'],
  [/co-creation/gi, 'đồng tạo'],
  [/participatory/gi, 'có sự tham gia'],
  [/commitment/gi, 'cam kết'],
  [/attitude/gi, 'thái độ'],
  [/intention/gi, 'ý định'],
  [/bookings?/gi, 'booking'],
  [/mediation/gi, 'vai trò trung gian'],
  [/moderation/gi, 'vai trò điều tiết'],
  [/speciesism/gi, 'speciesism'],
  [/methodology/gi, 'phương pháp luận'],
  [/hypothesis/gi, 'giả thuyết'],
  [/hypotheses/gi, 'giả thuyết'],
  [/reliability/gi, 'độ tin cậy thang đo'],
  [/structural results/gi, 'kết quả cấu trúc'],
  [/implications/gi, 'hàm ý'],
  [/statistical significance/gi, 'ý nghĩa thống kê'],
  [/regression/gi, 'hồi quy'],
  [/analysis of variance/gi, 'ANOVA'],
  [/survey/gi, 'khảo sát'],
  [/valid responses/gi, 'phản hồi hợp lệ'],
  [/validated shoppers/gi, 'người trả lời hợp lệ'],
  [/respondents/gi, 'người trả lời'],
  [/sample/gi, 'mẫu'],
  [/model/gi, 'mô hình'],
  [/method/gi, 'phương pháp'],
  [/methods/gi, 'phương pháp'],
  [/results/gi, 'kết quả'],
  [/background/gi, 'bối cảnh'],
  [/references/gi, 'tài liệu tham khảo'],
  [/source/gi, 'nguồn'],
  [/period/gi, 'giai đoạn'],
  [/context/gi, 'bối cảnh'],
  [/dataset/gi, 'dữ liệu'],
  [/authors/gi, 'tác giả'],
  [/strongest/gi, 'mạnh nhất'],
  [/primary/gi, 'chính'],
  [/reported/gi, 'được báo cáo'],
  [/illustrative/gi, 'minh họa'],
  [/direct links/gi, 'liên kết trực tiếp'],
  [/practical implications/gi, 'hàm ý thực tế'],
  [/concise/gi, 'ngắn gọn'],
  [/clear/gi, 'rõ'],
  [/focused/gi, 'tập trung'],
  [/useful/gi, 'hữu ích'],
  [/rather than/gi, 'thay vì'],
  [/instead of/gi, 'thay vì'],
  [/not only/gi, 'không chỉ'],
  [/does not/gi, 'không'],
  [/do not/gi, 'không'],
  [/helps/gi, 'giúp'],
  [/supports/gi, 'hỗ trợ'],
  [/shows/gi, 'cho thấy'],
  [/examines/gi, 'xem xét'],
  [/identifies/gi, 'xác định'],
  [/estimates/gi, 'ước tính'],
  [/translates/gi, 'chuyển thành'],
  [/frames/gi, 'định khung'],
  [/links/gi, 'liên kết'],
  [/groups/gi, 'gom nhóm'],
  [/includes/gi, 'bao gồm'],
  [/focuses on/gi, 'tập trung vào'],
  [/is organized around/gi, 'được tổ chức quanh'],
  [/is useful because/gi, 'hữu ích vì'],
  [/is most useful/gi, 'hữu ích nhất khi'],
  [/is aimed at/gi, 'hướng đến'],
  [/the objective is to/gi, 'mục tiêu là'],
  [/the output/gi, 'đầu ra'],
  [/the work/gi, 'phần nghiên cứu'],
  [/this page/gi, 'trang này'],
  [/this cluster/gi, 'cụm này'],
  [/this topic/gi, 'mảng này'],
  [/this study/gi, 'nghiên cứu này'],
  [/this insight/gi, 'ghi chú này'],
  [/the portfolio/gi, 'portfolio'],
  [/the site/gi, 'site'],
  [/the research/gi, 'nghiên cứu'],
  [/the analysis/gi, 'phân tích'],
  [/the model/gi, 'mô hình'],
  [/the experiment/gi, 'thử nghiệm'],
  [/the findings/gi, 'các phát hiện'],
  [/the result/gi, 'kết quả'],
  [/the problem/gi, 'vấn đề'],
  [/the method/gi, 'phương pháp'],
  [/the core challenge/gi, 'vấn đề cốt lõi'],
  [/page not found/gi, 'không tìm thấy trang'],
  [/not available/gi, 'không khả dụng'],
  [/old portfolio link/gi, 'link portfolio cũ'],
  [/redirected automatically/gi, 'tự động chuyển hướng'],
  [/continue browsing/gi, 'tiếp tục xem']
];

const MONTH_REPLACEMENTS = [
  [/(\d{1,2}) Apr (\d{4})/g, '$1/04/$2'],
  [/(\d{1,2}) Jan (\d{4})/g, '$1/01/$2'],
  [/(\d{1,2}) Jun(?:e)? (\d{4})/g, '$1/06/$2'],
  [/Jan (\d{4})/g, '01/$1'],
  [/Apr (\d{4})/g, '04/$1'],
  [/June (\d{1,2}), (\d{4})/g, '$1/06/$2']
];

const decodeHtml = (value) =>
  String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&bull;/g, '•')
    .replace(/&rarr;/g, '→')
    .replace(/&times;/g, '×')
    .replace(/&beta;/g, 'β')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const preserveCase = (source, replacement) => {
  if (!source) return replacement;
  if (source.toUpperCase() === source && source.length > 1) {
    if (/\s/.test(replacement) || VIETNAMESE_CHAR_RE.test(replacement)) return replacement;
    return replacement.toUpperCase();
  }
  if (source[0]?.toUpperCase() === source[0]) return `${replacement[0]?.toUpperCase() || ''}${replacement.slice(1)}`;
  return replacement;
};

const applyPhraseReplacements = (value) => {
  let next = value;
  for (const [pattern, replacement] of [...MONTH_REPLACEMENTS, ...PHRASE_REPLACEMENTS]) {
    next = next.replace(pattern, (...args) => {
      const matched = args[0];
      if (typeof replacement === 'string' && replacement.includes('$')) {
        return matched.replace(pattern, replacement);
      }
      return preserveCase(matched, replacement);
    });
  }
  return next;
};

const polishVietnameseSentence = (value) =>
  value
    .replace(/\bThis portfolio presents\b/i, 'Portfolio này trình bày')
    .replace(/\bThis portfolio may use\b/i, 'Portfolio này có thể dùng')
    .replace(/\bThis page collects\b/i, 'Trang này tập hợp')
    .replace(/\bThis page provides\b/i, 'Trang này cung cấp')
    .replace(/\bThis page groups\b/i, 'Trang này gom nhóm')
    .replace(/\bThis cluster brings together\b/i, 'Cụm này tập hợp')
    .replace(/\bThis cluster examines\b/i, 'Cụm này xem xét')
    .replace(/\bThis cluster covers\b/i, 'Cụm này bao quát')
    .replace(/\bThis topic examines\b/i, 'Mảng này xem xét')
    .replace(/\bThis consumer insights study examines\b/i, 'Nghiên cứu thấu hiểu người tiêu dùng này xem xét')
    .replace(/\bThis consumer insights study uses\b/i, 'Nghiên cứu thấu hiểu người tiêu dùng này dùng')
    .replace(/\bThis consumer insights study explores\b/i, 'Nghiên cứu thấu hiểu người tiêu dùng này tìm hiểu')
    .replace(/\bThis manuscript-aligned page summarizes\b/i, 'Trang này tóm tắt theo bản thảo')
    .replace(/\bThis study tests\b/i, 'Nghiên cứu này kiểm tra')
    .replace(/\bThe study shows\b/i, 'Nghiên cứu cho thấy')
    .replace(/\bThe output helps\b/i, 'Đầu ra giúp')
    .replace(/\bThe output supports\b/i, 'Đầu ra hỗ trợ')
    .replace(/\bThe value of this study is that\b/i, 'Giá trị của nghiên cứu nằm ở chỗ')
    .replace(/\bThe useful interpretation is not that\b/i, 'Cách đọc hữu ích không phải là')
    .replace(/\bThe objective is to\b/i, 'Mục tiêu là')
    .replace(/^Use these links to\b/i, 'Dùng các link này để')
    .replace(/^Use the\b/i, 'Dùng')
    .replace(/^Open\b/i, 'Mở')
    .replace(/^Review\b/i, 'Xem')
    .replace(/^Browse\b/i, 'Xem')
    .replace(/^Full\b/i, 'Bản đầy đủ')
    .replace(/^Back to\b/i, 'Quay lại')
    .replace(/\bViệt Namese\b/g, 'Vietnamese')
    .replace(/\bSwinburne Việt Nam\b/g, 'Swinburne Vietnam')
    .replace(/\btập trung on\b/gi, 'tập trung vào')
    .replace(/\bNghiên cứu insights\b/gi, 'Ghi chú nghiên cứu')
    .replace(/\bResearch phương pháp luận\b/gi, 'phương pháp nghiên cứu')
    .replace(/\bportfolio nghiên cứu\b/gi, 'portfolio nghiên cứu')
    .replace(/\bmarket portfolio nghiên cứu\b/gi, 'portfolio nghiên cứu thị trường')
    .replace(/\bin Việt Nam\b/gi, 'tại Việt Nam')
    .replace(/\bmô hìnhs\b/gi, 'mô hình')
    .replace(/\bChính mode\b/gi, 'Phương tiện chính')
    .replace(/\bHạn chế design\b/gi, 'Thiết kế hạn chế')
    .replace(/\bchuyển đổi-alternative\b/gi, 'phương án thay thế trong chuyển đổi')
    .replace(/\bminh họa bối cảnh image\b/gi, 'ảnh minh họa bối cảnh')
    .replace(/\bMinh họa hotel bối cảnh image\b/gi, 'Ảnh minh họa bối cảnh khách sạn')
    .replace(/\bPhương pháp sequence\b/gi, 'Trình tự phương pháp')
    .replace(/\blink trực tiếp\b/gi, 'liên kết trực tiếp')
    .replace(/\bthay vì treating\b/gi, 'thay vì xem')
    .replace(/\bthay vì treated\b/gi, 'thay vì xem')
    .replace(/\bfor Bản đầy đủ\b/gi, 'để xem đầy đủ')
    .replace(/\bBản đầy đủ list\b/gi, 'danh sách đầy đủ')
    .replace(/\bBản đầy đủ context\b/gi, 'bối cảnh đầy đủ')
    .replace(/\bXem vị trí\b/gi, 'review vị trí')
    .replace(/\btrainee-Xem vị trí\b/gi, 'review vị trí trainee')
    .replace(/\s+/g, ' ')
    .trim();

export const getLanguageForHtmlFile = (htmlFile) =>
  String(htmlFile || '').split(/[\\/]/)[0] === VI_PREFIX ? 'vi' : 'en';

export const sourceHtmlFileForLocalizedFile = (htmlFile) => {
  const normalized = String(htmlFile || '').replace(/\\/g, '/').replace(/^\/+/, '');
  return normalized.startsWith(`${VI_PREFIX}/`) ? normalized.slice(VI_PREFIX.length + 1) : normalized;
};

export const localizedHtmlFileForLanguage = (htmlFile, language) => {
  const source = sourceHtmlFileForLocalizedFile(htmlFile);
  return language === 'vi' ? `${VI_PREFIX}/${source}` : source;
};

export const translatePlainText = (value) => {
  const raw = decodeHtml(value).replace(/\s+/g, ' ').trim();
  if (!raw) return raw;
  const exact = EXACT_TEXT.get(raw);
  if (exact) return polishVietnameseSentence(applyPhraseReplacements(exact));
  const insightsTitleMatch = raw.match(/^(.+?)\s+\|\s+Insights\s+\|\s+Chung Hy Dai$/);
  if (insightsTitleMatch) {
    const translatedTitle = EXACT_TEXT.get(insightsTitleMatch[1]);
    if (translatedTitle) return `${polishVietnameseSentence(applyPhraseReplacements(translatedTitle))} | Ghi chú nghiên cứu | Chung Hy Dai`;
  }
  const titleMatch = raw.match(/^(.+?)\s+\|\s+Chung Hy Dai$/);
  if (titleMatch) {
    const translatedTitle = EXACT_TEXT.get(titleMatch[1]);
    if (translatedTitle) return `${polishVietnameseSentence(applyPhraseReplacements(translatedTitle))} | Chung Hy Dai`;
  }
  if (!LATIN_RE.test(raw) || VIETNAMESE_CHAR_RE.test(raw)) return raw;
  if (/^(?:CH|CHD|ORCID|GitHub|LinkedIn|ABSA|PRCA|Kano|SEM|EFA|CFA|DCE|ANOVA|UGC|EV|VTubers?)$/i.test(raw)) {
    return raw;
  }
  if (/^[\d\s.,:%+()=<>/×|&βRFnN-]+$/.test(raw)) return raw;

  const polished = polishVietnameseSentence(applyPhraseReplacements(raw));
  const exactAfterPolish = EXACT_TEXT.get(polished);
  return exactAfterPolish || polished;
};

const translateTextNode = (value) => {
  const original = String(value || '');
  const leading = original.match(/^\s*/)?.[0] || '';
  const trailing = original.match(/\s*$/)?.[0] || '';
  const core = original.slice(leading.length, original.length - trailing.length);
  if (!core.trim()) return original;
  return `${leading}${escapeHtml(translatePlainText(core))}${trailing}`;
};

const translateAttributeValue = (value) => {
  const raw = decodeHtml(value).trim();
  if (!raw || !LATIN_RE.test(raw)) return value;
  return escapeHtml(translatePlainText(raw));
};

const protectBlocks = (html) => {
  const protectedBlocks = [];
  const protectedHtml = html.replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, (match) => {
    const token = `%%I18N_PROTECTED_${protectedBlocks.length}%%`;
    protectedBlocks.push(match);
    return token;
  });
  return { protectedHtml, protectedBlocks };
};

const restoreBlocks = (html, protectedBlocks) =>
  protectedBlocks.reduce((next, block, index) => next.replace(`%%I18N_PROTECTED_${index}%%`, block), html);

export const translateHtmlVisibleText = (html) => {
  const { protectedHtml, protectedBlocks } = protectBlocks(html);
  let translated = protectedHtml.replace(/>([^<>]+)</g, (match, text) => `>${translateTextNode(text)}<`);
  translated = translated.replace(
    /\b(alt|aria-label|title|placeholder)\s*=\s*("([^"]*)"|'([^']*)')/gi,
    (match, attr, quoted, dquote, squote) => {
      const quote = quoted[0];
      const rawValue = dquote ?? squote ?? '';
      return `${attr}=${quote}${translateAttributeValue(rawValue)}${quote}`;
    }
  );
  return restoreBlocks(translated, protectedBlocks);
};

const shouldPrefixAssetRef = (rawValue) => {
  const value = String(rawValue || '').trim();
  if (!value || SKIP_PROTOCOL_RE.test(value) || value.startsWith('/')) return false;
  const normalized = value.startsWith('./') ? value.slice(2) : value;
  if (HTML_FILE_RE.test(normalized)) return false;
  return ASSET_REF_RE.test(normalized) || STATIC_ASSET_EXT_RE.test(normalized);
};

const prefixAssetRef = (rawValue) => {
  if (!shouldPrefixAssetRef(rawValue)) return rawValue;
  const value = String(rawValue);
  return value.startsWith('./') ? `../${value.slice(2)}` : `../${value}`;
};

const rewriteSrcsetForVi = (value) =>
  String(value || '')
    .split(',')
    .map((candidate) => {
      const trimmed = candidate.trim();
      if (!trimmed) return candidate;
      const parts = trimmed.split(/\s+/);
      parts[0] = prefixAssetRef(parts[0]);
      return parts.join(' ');
    })
    .join(', ');

const rewriteCssUrlsForVi = (html) =>
  html.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/gi, (match, quote, rawValue) => {
    const rewritten = prefixAssetRef(rawValue.trim());
    return `url(${quote}${rewritten}${quote})`;
  });

const rewriteAssetRefsForVi = (html) => {
  let rewritten = html.replace(
    /\b(href|src|poster|data-modal-img)\s*=\s*("([^"]*)"|'([^']*)')/gi,
    (match, attr, quoted, dquote, squote) => {
      const quote = quoted[0];
      const rawValue = dquote ?? squote ?? '';
      return `${attr}=${quote}${prefixAssetRef(rawValue)}${quote}`;
    }
  );
  rewritten = rewritten.replace(
    /\b(srcset|imagesrcset)\s*=\s*("([^"]*)"|'([^']*)')/gi,
    (match, attr, quoted, dquote, squote) => {
      const quote = quoted[0];
      const rawValue = dquote ?? squote ?? '';
      return `${attr}=${quote}${rewriteSrcsetForVi(rawValue)}${quote}`;
    }
  );
  rewritten = rewriteCssUrlsForVi(rewritten);
  return rewritten;
};

export const setHtmlLanguage = (html, language) => {
  const lang = language === 'vi' ? 'vi' : 'en';
  if (/<html\b[^>]*\blang\s*=/i.test(html)) {
    return html.replace(/<html\b([^>]*?)\blang\s*=\s*["'][^"']*["']([^>]*)>/i, `<html$1lang="${lang}"$2>`);
  }
  return html.replace(/<html\b([^>]*)>/i, `<html$1 lang="${lang}">`);
};

const buildSwitcherHref = (htmlFile, currentLanguage, targetLanguage) => {
  const source = sourceHtmlFileForLocalizedFile(htmlFile);
  if (currentLanguage === 'vi' && targetLanguage === 'en') return `../${source}`;
  if (currentLanguage === 'en' && targetLanguage === 'vi') return `${VI_PREFIX}/${source}`;
  return source;
};

const LANGUAGE_SWITCHER_PLACEHOLDER = '<!-- LANGUAGE_SWITCHER -->';

export const applyLanguageSwitcher = (html, htmlFile, language) => {
  const currentLanguage = language === 'vi' ? 'vi' : 'en';
  const switcherLabel = currentLanguage === 'vi' ? 'Chuyển ngôn ngữ' : 'Language switcher';
  const enLabel = 'English version';
  const viLabel = currentLanguage === 'vi' ? 'Bản tiếng Việt' : 'Vietnamese version';
  const visibleLabel = currentLanguage === 'vi' ? 'Ngôn ngữ' : 'Language';
  const switcher = `<div class="language-switcher" aria-label="${switcherLabel}">
<span class="language-switcher__label">${visibleLabel}</span>
<a class="language-switcher__link${currentLanguage === 'en' ? ' is-active' : ''}" href="${buildSwitcherHref(htmlFile, currentLanguage, 'en')}" hreflang="en" lang="en"${currentLanguage === 'en' ? ' aria-current="true"' : ''}>EN<span class="sr-only"> ${enLabel}</span></a>
<a class="language-switcher__link${currentLanguage === 'vi' ? ' is-active' : ''}" href="${buildSwitcherHref(htmlFile, currentLanguage, 'vi')}" hreflang="vi" lang="vi"${currentLanguage === 'vi' ? ' aria-current="true"' : ''}>VI<span class="sr-only"> ${viLabel}</span></a>
</div>`;

  if (html.includes(LANGUAGE_SWITCHER_PLACEHOLDER)) {
    return html.split(LANGUAGE_SWITCHER_PLACEHOLDER).join(switcher);
  }

  if (html.includes('class="language-switcher"')) return html;

  const navPattern = /(<div\b[^>]*\bclass\s*=\s*["'][^"']*\bnav-links\b[^"']*["'][^>]*\bid\s*=\s*["']site-nav-links["'][^>]*>)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/nav>)/i;
  if (navPattern.test(html)) {
    return html.replace(navPattern, (match, open, content, close) => `${open}${content}\n${switcher}\n${close}`);
  }
  return html.replace(/<\/nav>/i, `${switcher}\n</nav>`);
};

export const buildVietnamesePage = ({ html, htmlFile }) => {
  let next = html;
  next = setHtmlLanguage(next, 'vi');
  next = rewriteAssetRefsForVi(next);
  next = translateHtmlVisibleText(next);
  next = applyLanguageSwitcher(next, htmlFile, 'vi');
  return next;
};

export const applyEnglishLanguageChrome = (html, htmlFile) =>
  applyLanguageSwitcher(setHtmlLanguage(html, 'en'), htmlFile, 'en');

export const localizeAbsolutePageUrl = (siteUrl, htmlFile, language) => {
  const source = sourceHtmlFileForLocalizedFile(htmlFile);
  const localized = localizedHtmlFileForLanguage(source, language);
  const normalized = localized.replace(/\\/g, '/');
  if (path.posix.basename(normalized).toLowerCase() === 'index.html') {
    const dir = path.posix.dirname(normalized);
    return new URL(dir === '.' ? './' : `${dir.replace(/^\.\//, '')}/`, siteUrl).href;
  }
  return new URL(normalized, siteUrl).href;
};

export const buildHreflangBlock = ({ siteUrl, htmlFile }) => {
  const source = sourceHtmlFileForLocalizedFile(htmlFile);
  const enUrl = localizeAbsolutePageUrl(siteUrl, source, 'en');
  const viUrl = localizeAbsolutePageUrl(siteUrl, source, 'vi');
  return `<!-- SEO-GENERATED:hreflang:START -->
<link href="${enUrl}" hreflang="en" rel="alternate"/>
<link href="${viUrl}" hreflang="vi" rel="alternate"/>
<link href="${enUrl}" hreflang="x-default" rel="alternate"/>
<!-- SEO-GENERATED:hreflang:END -->`;
};

export const translateKeywordList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => translatePlainText(item.trim()))
    .filter(Boolean)
    .join(', ');

export const localizeStructuredDataForVietnamese = (value, siteUrl) => {
  const localizeUrl = (raw) => {
    if (typeof raw !== 'string' || !raw.startsWith(siteUrl)) return raw;
    try {
      const parsed = new URL(raw);
      const site = new URL(siteUrl);
      if (parsed.origin !== site.origin) return raw;
      if (/^\/(?:assets|dist|feed\.xml|sitemap\.xml|image-sitemap\.xml)/i.test(parsed.pathname)) return raw;
      if (parsed.pathname.startsWith('/vi/')) return raw;
      if (parsed.pathname === '/' || parsed.pathname === '/index.html') {
        parsed.pathname = '/vi/';
        return parsed.href;
      }
      if (/\.html$/i.test(parsed.pathname)) {
        parsed.pathname = `/vi${parsed.pathname}`;
        return parsed.href;
      }
      return raw;
    } catch {
      return raw;
    }
  };

  const visit = (node) => {
    if (Array.isArray(node)) return node.map(visit);
    if (!node || typeof node !== 'object') return localizeUrl(node);

    const next = {};
    for (const [key, item] of Object.entries(node)) {
      if (['name', 'headline', 'description', 'articleSection', 'keywords', 'alternateName'].includes(key)) {
        next[key] = Array.isArray(item)
          ? item.map((part) => (typeof part === 'string' ? translatePlainText(part) : visit(part)))
          : typeof item === 'string'
            ? translatePlainText(item)
            : visit(item);
        continue;
      }
      next[key] = visit(item);
    }

    const type = Array.isArray(next['@type']) ? next['@type'].join(' ') : String(next['@type'] || '');
    if (/WebSite|WebPage|AboutPage|ProfilePage|CollectionPage|BlogPosting|CreativeWork|ScholarlyArticle/i.test(type)) {
      next.inLanguage = 'vi';
    }
    return next;
  };

  return visit(value);
};
