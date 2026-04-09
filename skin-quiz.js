// Skin Quiz Interactive JavaScript
class SkinQuiz {
    constructor() {
        console.log('SkinQuiz constructor called');
        this.currentQuestion = 1;
        this.totalQuestions = 8;
        this.responses = {};
        
        // Initialize analyzer if available, otherwise use null
        if (typeof SkinAnalyzer !== 'undefined') {
            try {
                this.analyzer = new SkinAnalyzer();
                console.log('SkinAnalyzer created successfully');
            } catch (error) {
                console.error('Error creating SkinAnalyzer:', error);
                this.analyzer = null;
            }
        } else {
            console.warn('SkinAnalyzer not available, quiz will work in basic mode');
            this.analyzer = null;
        }
        
        this.init();
    }

    init() {
        console.log('SkinQuiz init() called');
        try {
            this.setupEventListeners();
            console.log('Event listeners setup complete');
            this.updateProgress();
            console.log('Progress updated');
            this.loadSavedProfile();
            console.log('Saved profile loaded');
        } catch (error) {
            console.error('Error in SkinQuiz init:', error);
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Check if elements exist
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const submitBtn = document.getElementById('submit-btn');
        const form = document.getElementById('skin-quiz-form');
        
        console.log('Elements found:', {
            nextBtn: !!nextBtn,
            prevBtn: !!prevBtn,
            submitBtn: !!submitBtn,
            form: !!form
        });
        
        // Navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        } else {
            console.error('Next button not found');
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        } else {
            console.error('Previous button not found');
        }
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitQuiz());
        } else {
            console.error('Submit button not found');
        }
        
        // Radio button changes
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        console.log('Found radio buttons:', radioButtons.length);
        
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => this.handleAnswerChange());
        });

        // Form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitQuiz();
            });
        } else {
            console.error('Quiz form not found');
        }
        
        console.log('Event listeners setup complete');
    }

    handleAnswerChange() {
        const currentQuestionBlock = document.querySelector(`.question-block[data-question="${this.currentQuestion}"]`);
        const selectedOption = currentQuestionBlock.querySelector('input[type="radio"]:checked');
        
        if (selectedOption) {
            const questionName = selectedOption.name;
            this.responses[questionName] = selectedOption.value;
            
            // Enable next button
            document.getElementById('next-btn').disabled = false;
            
            // Add visual feedback
            this.updateOptionCards(currentQuestionBlock);
        }
    }

    updateOptionCards(questionBlock) {
        const cards = questionBlock.querySelectorAll('.option-card');
        cards.forEach(card => {
            const radio = card.querySelector('input[type="radio"]');
            if (radio.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            // Validate current question
            if (!this.validateCurrentQuestion()) {
                this.showNotification('Please select an answer before continuing', 'error');
                return;
            }

            // Hide current question
            const currentBlock = document.querySelector(`.question-block[data-question="${this.currentQuestion}"]`);
            currentBlock.classList.remove('active');
            currentBlock.classList.add('fade-out-left');

            // Show next question
            this.currentQuestion++;
            setTimeout(() => {
                const nextBlock = document.querySelector(`.question-block[data-question="${this.currentQuestion}"]`);
                nextBlock.classList.add('active');
                nextBlock.classList.add('fade-in-right');
                
                this.updateProgress();
                this.updateNavigationButtons();
            }, 300);
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 1) {
            // Hide current question
            const currentBlock = document.querySelector(`.question-block[data-question="${this.currentQuestion}"]`);
            currentBlock.classList.remove('active');
            currentBlock.classList.add('fade-out-right');

            // Show previous question
            this.currentQuestion--;
            setTimeout(() => {
                const prevBlock = document.querySelector(`.question-block[data-question="${this.currentQuestion}"]`);
                prevBlock.classList.add('active');
                prevBlock.classList.add('fade-in-left');
                
                this.updateProgress();
                this.updateNavigationButtons();
                this.updateOptionCards(prevBlock);
            }, 300);
        }
    }

    validateCurrentQuestion() {
        const currentBlock = document.querySelector(`.question-block[data-question="${this.currentQuestion}"]`);
        const selectedOption = currentBlock.querySelector('input[type="radio"]:checked');
        return selectedOption !== null;
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const currentQuestionSpan = document.getElementById('current-question');
        const totalQuestionsSpan = document.getElementById('total-questions');
        
        const progress = (this.currentQuestion / this.totalQuestions) * 100;
        progressFill.style.width = `${progress}%`;
        
        currentQuestionSpan.textContent = this.currentQuestion;
        totalQuestionsSpan.textContent = this.totalQuestions;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        // Previous button
        prevBtn.disabled = this.currentQuestion === 1;

        // Next/Submit button
        if (this.currentQuestion === this.totalQuestions) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-flex';
        } else {
            nextBtn.style.display = 'inline-flex';
            submitBtn.style.display = 'none';
            nextBtn.disabled = !this.validateCurrentQuestion();
        }
    }

    async submitQuiz() {
        if (!this.validateAllQuestions()) {
            this.showNotification('Please answer all questions before submitting', 'error');
            return;
        }

        // Show loading state
        this.showLoadingState();

        // Analyze responses
        setTimeout(() => {
            const analysis = this.analyzer.analyzeSkin(this.responses);
            const recommendations = this.analyzer.generatePersonalizedRecommendations(analysis);

            // Save profile
            this.analyzer.saveUserProfile(analysis);

            // Show results
            this.displayResults(analysis, recommendations);
        }, 1500);
    }

    validateAllQuestions() {
        for (let i = 1; i <= this.totalQuestions; i++) {
            const questionBlock = document.querySelector(`.question-block[data-question="${i}"]`);
            const selectedOption = questionBlock.querySelector('input[type="radio"]:checked');
            if (!selectedOption) return false;
        }
        return true;
    }

    showLoadingState() {
        const quizContainer = document.querySelector('.quiz-container');
        quizContainer.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner">
                    <i class="fas fa-magic"></i>
                    <h3>Analyzing your skin profile...</h3>
                    <p>Finding the perfect sunscreen match for you</p>
                </div>
            </div>
        `;
    }

    displayResults(analysis, recommendations) {
        // Hide quiz section
        document.querySelector('.quiz-section').style.display = 'none';

        // Show results section
        const resultsSection = document.getElementById('results-section');
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in-up');

        // Display profile summary
        this.displayProfileSummary(analysis.analysis_summary);

        // Display recommendations
        this.displayRecommendations(recommendations);

        // Display personalized tips
        this.displayPersonalizedTips(recommendations.personalized_tips);

        // Scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    displayProfileSummary(summary) {
        const profileSummary = document.getElementById('profile-summary');
        profileSummary.innerHTML = `
            <div class="summary-item">
                <strong>Your Profile:</strong> ${summary.profile}
            </div>
            <div class="summary-item">
                <strong>Key Concerns:</strong> ${summary.key_concerns.join(', ')}
            </div>
            <div class="summary-item">
                <strong>Recommended SPF:</strong> ${summary.spf_recommendation}
            </div>
            <div class="summary-item">
                <strong>Confidence:</strong> ${summary.confidence_description}
            </div>
        `;
    }

    displayRecommendations(recommendations) {
        // Primary recommendation
        const primaryProduct = document.getElementById('primary-product');
        if (recommendations.primary) {
            primaryProduct.innerHTML = this.createProductCard(recommendations.primary, 'primary');
        }

        // Secondary recommendations
        const secondaryProducts = document.getElementById('secondary-products');
        if (recommendations.secondary && recommendations.secondary.length > 0) {
            secondaryProducts.innerHTML = recommendations.secondary
                .map(product => this.createProductCard(product, 'secondary'))
                .join('');
        }
    }

    createProductCard(product, type) {
        const isPrimary = type === 'primary';
        return `
            <div class="recommended-product ${isPrimary ? 'primary' : 'secondary'}">
                <div class="product-image">
                    <div class="product-bottle-preview ${product.category}"></div>
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-spf">${product.spf === 50 ? 'SPF 50+' : 'SPF 30+'}</p>
                    <p class="product-price">Rs. ${product.price}</p>
                    <div class="product-features">
                        ${product.benefits.slice(0, 3).map(benefit => 
                            `<span class="feature-tag">${benefit}</span>`
                        ).join('')}
                    </div>
                    <div class="match-reason">
                        <strong>Perfect because:</strong> ${product.match_reason}
                    </div>
                    <button class="btn btn-primary" onclick="addToCartAndGoToProduct('${product.id}')">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
    }

    displayPersonalizedTips(tips) {
        const tipsContainer = document.getElementById('tips-container');
        tipsContainer.innerHTML = `
            <div class="tips-grid">
                ${tips.map((tip, index) => `
                    <div class="tip-card fade-in-up" style="animation-delay: ${index * 0.1}s">
                        <div class="tip-icon">
                            <i class="fas fa-lightbulb"></i>
                        </div>
                        <p>${tip}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: 'linear-gradient(135deg, #2a9d8f, #264653)',
            error: 'linear-gradient(135deg, #e76f51, #f4a261)',
            info: 'linear-gradient(135deg, #f4a261, #e9c46a)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    loadSavedProfile() {
        const savedProfile = this.analyzer.loadUserProfile();
        if (savedProfile) {
            // Pre-fill saved answers
            Object.keys(savedProfile).forEach(key => {
                const radio = document.querySelector(`input[name="${key}"][value="${savedProfile[key]}"]`);
                if (radio) {
                    radio.checked = true;
                    this.responses[key] = savedProfile[key];
                }
            });

            // Update UI
            this.updateProgress();
            this.updateNavigationButtons();
            
            // Show notification
            this.showNotification('Previous skin profile loaded', 'success');
        }
    }

    resetQuiz() {
        this.currentQuestion = 1;
        this.responses = {};
        
        // Reset form
        document.getElementById('skin-quiz-form').reset();
        
        // Reset UI
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Show first question
        document.querySelectorAll('.question-block').forEach((block, index) => {
            block.classList.remove('active', 'fade-out-left', 'fade-in-right');
            if (index === 0) {
                block.classList.add('active');
            }
        });
        
        // Reset progress
        this.updateProgress();
        this.updateNavigationButtons();
        
        // Hide results, show quiz
        document.getElementById('results-section').style.display = 'none';
        document.querySelector('.quiz-section').style.display = 'block';
    }
}

// Global functions
function retakeQuiz() {
    if (window.skinQuiz) {
        window.skinQuiz.resetQuiz();
    }
}

function addToCartAndGoToProduct(productId) {
    if (window.cartManager) {
        window.cartManager.addToCart(productId, 1);
    }
    
    // Go to products page after a short delay
    setTimeout(() => {
        window.location.href = 'products.html';
    }, 1000);
}

function goToProducts() {
    window.location.href = 'products.html';
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    initializeQuiz();
});

// Also try immediate initialization as fallback
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('Document already loaded, initializing immediately');
    setTimeout(initializeQuiz, 100);
}

function initializeQuiz() {
    console.log('Attempting to initialize quiz...');
    console.log('SkinAnalyzer available:', typeof SkinAnalyzer !== 'undefined');
    
    // Try to create quiz regardless of analyzer availability
    try {
        window.skinQuiz = new SkinQuiz();
        console.log('Skin Quiz initialized successfully');
        
        // Test basic functionality
        setTimeout(() => {
            console.log('Testing quiz functionality...');
            if (window.skinQuiz && window.skinQuiz.currentQuestion === 1) {
                console.log('Quiz is working!');
                // Make first question visible
                const firstQuestion = document.querySelector('.question-block[data-question="1"]');
                if (firstQuestion) {
                    firstQuestion.classList.add('active');
                    console.log('First question made active');
                }
            }
        }, 500);
        
    } catch (error) {
        console.error('Error initializing Skin Quiz:', error);
    }
}
