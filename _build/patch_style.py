css_content = """
/* --- CONTINUOUS DYNAMIC ELEMENTS --- */

/* 1. Continuous Floating Animation (Hero Visuals) */
.continuous-float {
    animation: continuousFloat 6s ease-in-out infinite;
    will-change: transform;
}

@keyframes continuousFloat {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
}

/* 2. Abstract Data Nodes (Hero Background) */
.data-node {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.4;
    z-index: 1; /* Behind hero content */
    pointer-events: none;
    animation: dataNodeDrift linear infinite;
    will-change: transform, opacity;
}

/* Node Variants */
.node-1 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, var(--accent-primary) 0%, transparent 70%);
    top: 10%;
    left: -5%;
    animation-duration: 25s;
    animation-direction: alternate;
}

.node-2 {
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, var(--c-purple) 0%, transparent 70%);
    bottom: 20%;
    right: 15%;
    animation-duration: 30s;
    animation-direction: alternate-reverse;
}

.node-3 {
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, var(--c-cyan) 0%, transparent 70%);
    top: 40%;
    left: 40%;
    animation-duration: 20s;
}

@keyframes dataNodeDrift {
    0% { transform: translate(0px, 0px) scale(1); opacity: 0.3; }
    33% { transform: translate(30px, -50px) scale(1.1); opacity: 0.5; }
    66% { transform: translate(-20px, 20px) scale(0.9); opacity: 0.3; }
    100% { transform: translate(0px, 0px) scale(1); opacity: 0.3; }
}

/* 3. Marquee Updates */
.marquee-container {
    overflow: hidden;
    white-space: nowrap;
    padding: 1.5rem 0;
    font-family: var(--font-mono);
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 2px;
    background: var(--bg-secondary);
    border-top: 1px solid var(--glass-border);
    border-bottom: 1px solid var(--glass-border);
    position: relative;
    display: flex; /* Ensure flex for seamless loop */
    width: 100vw; /* Force full width */
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
}

/* Add subtle fading edges to marquee */
.marquee-container::before,
.marquee-container::after {
    content: "";
    position: absolute;
    top: 0;
    width: 100px;
    height: 100%;
    z-index: 2;
    pointer-events: none;
}
.marquee-container::before {
    left: 0;
    background: linear-gradient(to right, var(--bg-secondary), transparent);
}
.marquee-container::after {
    right: 0;
    background: linear-gradient(to left, var(--bg-secondary), transparent);
}

.marquee-content {
    display: flex;
    flex-shrink: 0;
    justify-content: space-around;
    min-width: 100%;
    animation: marquee 25s linear infinite;
}

.marquee-content span {
    padding: 0 2rem;
    color: var(--text-primary);
}

.marquee-content .separator {
    color: var(--accent-primary);
    opacity: 0.5;
}

@keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
}
"""

with open("style.css", "a") as f:
    f.write("\n" + css_content + "\n")
print("Appended dynamic elements CSS to style.css")
