import re

def update_file(filepath, new_skills_content):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find the skills-grid-new block
    pattern = r'(<div class="skills-grid-new reveal">).*?(</div>\s*</div>\s*</section>)'
    
    # We replace everything between <div class="skills-grid-new reveal"> and the closing </section>
    new_content = re.sub(pattern, r'\1\n' + new_skills_content + r'\n\2', content, flags=re.DOTALL)
    
    with open(filepath, 'w') as f:
        f.write(new_content)
    print(f"Updated {filepath}")

english_skills = """                    <div class="skill-category apple-skill-card">
                        <h3>Data & Analytics Stack</h3>
                        <div class="tech-grid">
                            <div class="tech-item"><i class="ph-fill ph-code"></i> Python (Pandas, Numpy)</div>
                            <div class="tech-item"><i class="ph-fill ph-database"></i> SQL / ETL Pipelines</div>
                            <div class="tech-item"><i class="ph-fill ph-brain"></i> NLP (RoBERTa, BERT)</div>
                            <div class="tech-item"><i class="ph-fill ph-math-operations"></i> Clustering (GMM, K-Means)</div>
                            <div class="tech-item"><i class="ph-fill ph-chart-pie-slice"></i> PowerBI & Tableau</div>
                            <div class="tech-item"><i class="ph-fill ph-git-branch"></i> Git Version Control</div>
                        </div>
                    </div>
                    <div class="skill-category apple-skill-card">
                        <h3>Data Strategy & Products</h3>
                        <div class="tech-grid">
                            <div class="tech-item"><i class="ph-fill ph-chart-bar"></i> Dashboards & Metrics Definition</div>
                            <div class="tech-item"><i class="ph-fill ph-files"></i> Large Dataset Preprocessing</div>
                            <div class="tech-item"><i class="ph-fill ph-cube"></i> "Data as a Product" Design</div>
                            <div class="tech-item"><i class="ph-fill ph-tree-structure"></i> Issue Trees / MECE</div>
                        </div>
                    </div>
                    <div class="skill-category apple-skill-card">
                        <h3>Advanced Analytics</h3>
                        <div class="tech-grid">
                            <div class="tech-item"><i class="ph-fill ph-arrows-split"></i> A/B Testing</div>
                            <div class="tech-item"><i class="ph-fill ph-exam"></i> Quantitative Survey Design</div>
                            <div class="tech-item"><i class="ph-fill ph-users"></i> Discrete Choice Experiments</div>
                            <div class="tech-item"><i class="ph-fill ph-function"></i> Statistical Testing (ANOVA, Logit)</div>
                        </div>
                    </div>"""

vietnamese_skills = """                    <div class="skill-category apple-skill-card">
                        <h3>Nền tảng Dữ liệu & Phân tích</h3>
                        <div class="tech-grid">
                            <div class="tech-item"><i class="ph-fill ph-code"></i> Python (Pandas, Numpy)</div>
                            <div class="tech-item"><i class="ph-fill ph-database"></i> SQL / Quy trình Xử lý (ETL)</div>
                            <div class="tech-item"><i class="ph-fill ph-brain"></i> NLP (RoBERTa, BERT)</div>
                            <div class="tech-item"><i class="ph-fill ph-math-operations"></i> Phân cụm (GMM, K-Means)</div>
                            <div class="tech-item"><i class="ph-fill ph-chart-pie-slice"></i> PowerBI & Tableau</div>
                            <div class="tech-item"><i class="ph-fill ph-git-branch"></i> Quản lý Phiên bản Git</div>
                        </div>
                    </div>
                    <div class="skill-category apple-skill-card">
                        <h3>Sản phẩm & Chiến lược Dữ liệu</h3>
                        <div class="tech-grid">
                            <div class="tech-item"><i class="ph-fill ph-chart-bar"></i> Xây dựng Dashboard & Chỉ số đo lường</div>
                            <div class="tech-item"><i class="ph-fill ph-files"></i> Tiền xử lý Dữ liệu Quy mô lớn</div>
                            <div class="tech-item"><i class="ph-fill ph-cube"></i> Tư duy "Dữ liệu là một Sản phẩm"</div>
                            <div class="tech-item"><i class="ph-fill ph-tree-structure"></i> Issue Trees / MECE</div>
                        </div>
                    </div>
                    <div class="skill-category apple-skill-card">
                        <h3>Phân tích Chuyên sâu</h3>
                        <div class="tech-grid">
                            <div class="tech-item"><i class="ph-fill ph-arrows-split"></i> Thử nghiệm A/B</div>
                            <div class="tech-item"><i class="ph-fill ph-exam"></i> Thiết kế Khảo sát Định lượng</div>
                            <div class="tech-item"><i class="ph-fill ph-users"></i> Thí nghiệm Lựa chọn Rời rạc</div>
                            <div class="tech-item"><i class="ph-fill ph-function"></i> Kiểm định Thống kê (ANOVA, Logit)</div>
                        </div>
                    </div>"""

update_file('index.html', english_skills)
update_file('index-vi.html', vietnamese_skills)
