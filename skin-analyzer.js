// Skin Analysis and Product Recommendation System
class SkinAnalyzer {
    constructor() {
        this.skinDataset = this.loadSkinDataset();
        this.products = this.loadProducts();
        this.userProfile = null;
    }

    loadSkinDataset() {
        return [
            {
                skin_type: 'oily',
                skin_tone: 'fair',
                recommended_spf: 50,
                product_type: 'matte gel',
                features: ['no white cast', 'sweat proof', 'oil control'],
                concerns: ['shine', 'enlarged pores', 'acne']
            },
            {
                skin_type: 'oily',
                skin_tone: 'medium',
                recommended_spf: 50,
                product_type: 'matte gel',
                features: ['no white cast', 'sweat proof', 'oil control'],
                concerns: ['shine', 'enlarged pores', 'acne']
            },
            {
                skin_type: 'oily',
                skin_tone: 'dark',
                recommended_spf: 50,
                product_type: 'matte gel',
                features: ['no white cast', 'sweat proof', 'oil control'],
                concerns: ['shine', 'enlarged pores', 'acne']
            },
            {
                skin_type: 'dry',
                skin_tone: 'fair',
                recommended_spf: 30,
                product_type: 'cream',
                features: ['hydrating', 'no white cast', 'nourishing'],
                concerns: ['dryness', 'flakiness', 'fine lines']
            },
            {
                skin_type: 'dry',
                skin_tone: 'medium',
                recommended_spf: 30,
                product_type: 'cream',
                features: ['hydrating', 'no white cast', 'nourishing'],
                concerns: ['dryness', 'flakiness', 'fine lines']
            },
            {
                skin_type: 'dry',
                skin_tone: 'dark',
                recommended_spf: 50,
                product_type: 'cream',
                features: ['hydrating', 'no white cast', 'nourishing'],
                concerns: ['dryness', 'flakiness', 'uneven tone']
            },
            {
                skin_type: 'combination',
                skin_tone: 'fair',
                recommended_spf: 50,
                product_type: 'lotion',
                features: ['balanced', 'no white cast', 'lightweight'],
                concerns: ['oily T-zone', 'dry cheeks', 'enlarged pores']
            },
            {
                skin_type: 'combination',
                skin_tone: 'medium',
                recommended_spf: 50,
                product_type: 'lotion',
                features: ['balanced', 'no white cast', 'lightweight'],
                concerns: ['oily T-zone', 'dry cheeks', 'enlarged pores']
            },
            {
                skin_type: 'combination',
                skin_tone: 'dark',
                recommended_spf: 50,
                product_type: 'lotion',
                features: ['balanced', 'no white cast', 'lightweight'],
                concerns: ['oily T-zone', 'dry cheeks', 'uneven tone']
            },
            {
                skin_type: 'acne',
                skin_tone: 'fair',
                recommended_spf: 50,
                product_type: 'gel',
                features: ['non-comedogenic', 'no white cast', 'oil free'],
                concerns: ['acne', 'breakouts', 'scars']
            },
            {
                skin_type: 'acne',
                skin_tone: 'medium',
                recommended_spf: 50,
                product_type: 'gel',
                features: ['non-comedogenic', 'no white cast', 'oil free'],
                concerns: ['acne', 'breakouts', 'scars']
            },
            {
                skin_type: 'acne',
                skin_tone: 'dark',
                recommended_spf: 50,
                product_type: 'gel',
                features: ['non-comedogenic', 'no white cast', 'oil free'],
                concerns: ['acne', 'breakouts', 'dark spots']
            }
        ];
    }

    loadProducts() {
        return [
            {
                id: 'oily-skin-solution',
                name: 'Oily Skin Solution',
                category: 'oily',
                spf: 50,
                price: 599,
                skin_types: ['oily'],
                skin_tones: ['fair', 'medium', 'dark'],
                product_type: 'matte gel',
                key_ingredients: ['niacinamide', 'zinc oxide', 'salicylic acid'],
                benefits: ['Oil control', 'Mattifying effect', 'No white cast'],
                texture: 'Lightweight, non-greasy',
                finish: 'Matte',
                climate_suitability: ['humid', 'hot', 'tropical']
            },
            {
                id: 'dry-skin-comfort',
                name: 'Dry Skin Comfort',
                category: 'dry',
                spf: 30,
                price: 599,
                skin_types: ['dry'],
                skin_tones: ['fair', 'medium', 'dark'],
                product_type: 'cream',
                key_ingredients: ['hyaluronic acid', 'ceramides', 'glycerin'],
                benefits: ['Deep hydration', 'Nourishing', 'No white cast'],
                texture: 'Rich, non-greasy',
                finish: 'Dewy',
                climate_suitability: ['dry', 'cold', 'moderate']
            },
            {
                id: 'combination-skin-balance',
                name: 'Combination Skin Balance',
                category: 'combination',
                spf: 50,
                price: 599,
                skin_types: ['combination'],
                skin_tones: ['fair', 'medium', 'dark'],
                product_type: 'lotion',
                key_ingredients: ['green tea extract', 'vitamin E', 'niacinamide'],
                benefits: ['Balanced hydration', 'Oil control', 'No white cast'],
                texture: 'Lightweight, balanced',
                finish: 'Natural',
                climate_suitability: ['moderate', 'humid', 'dry']
            },
            {
                id: 'acne-prone-shield',
                name: 'Acne-Prone Skin Shield',
                category: 'acne',
                spf: 50,
                price: 649,
                skin_types: ['acne', 'oily'],
                skin_tones: ['fair', 'medium', 'dark'],
                product_type: 'gel',
                key_ingredients: ['salicylic acid', 'tea tree oil', 'zinc oxide'],
                benefits: ['Non-comedogenic', 'Acne prevention', 'No white cast'],
                texture: 'Oil-free, lightweight',
                finish: 'Matte',
                climate_suitability: ['humid', 'hot', 'polluted']
            },
            {
                id: 'tinted-oily-skin',
                name: 'Tinted Oily Skin Solution',
                category: 'oily',
                spf: 50,
                price: 699,
                skin_types: ['oily'],
                skin_tones: ['fair', 'medium', 'dark'],
                product_type: 'tinted matte gel',
                key_ingredients: ['niacinamide', 'titanium dioxide', 'iron oxides'],
                benefits: ['Light coverage', 'Oil control', 'No white cast'],
                texture: 'Lightweight, buildable',
                finish: 'Matte',
                climate_suitability: ['humid', 'hot', 'urban']
            },
            {
                id: 'luxury-dry-skin',
                name: 'Luxury Dry Skin Formula',
                category: 'dry',
                spf: 50,
                price: 899,
                skin_types: ['dry', 'mature'],
                skin_tones: ['fair', 'medium', 'dark'],
                product_type: 'luxury cream',
                key_ingredients: ['peptides', 'botanical extracts', 'retinol'],
                benefits: ['Anti-aging', 'Deep hydration', 'No white cast'],
                texture: 'Rich, luxurious',
                finish: 'Radiant',
                climate_suitability: ['dry', 'moderate', 'air-conditioned']
            }
        ];
    }

    analyzeSkin(responses) {
        const analysis = {
            skin_type: this.determineSkinType(responses),
            skin_tone: this.determineSkinTone(responses),
            concerns: this.identifyConcerns(responses),
            climate: this.determineClimate(responses),
            lifestyle: this.analyzeLifestyle(responses),
            confidence: 0
        };

        analysis.confidence = this.calculateConfidence(analysis, responses);
        return analysis;
    }

    determineSkinType(responses) {
        const { oiliness, dryness, sensitivity, breakouts } = responses;
        
        let score = {
            oily: 0,
            dry: 0,
            combination: 0,
            acne: 0
        };

        // Oiliness scoring
        if (oiliness === 'very_oily') score.oily += 3;
        else if (oiliness === 'oily') score.oily += 2;
        else if (oiliness === 'slightly_oily') score.oily += 1;
        
        if (oiliness === 'very_dry') score.dry += 3;
        else if (oiliness === 'dry') score.dry += 2;
        else if (oiliness === 'slightly_dry') score.dry += 1;
        
        // Combination scoring
        if (oiliness === 'normal' && dryness === 'normal') score.combination += 2;
        if (oiliness === 'oily' && dryness === 'dry') score.combination += 3;
        
        // Acne scoring
        if (breakouts === 'frequent') score.acne += 3;
        else if (breakouts === 'occasional') score.acne += 2;
        else if (breakouts === 'rare') score.acne += 1;
        
        if (sensitivity === 'very_sensitive') score.acne += 2;
        if (sensitivity === 'sensitive') score.acne += 1;
        
        // Determine highest score
        const maxScore = Math.max(...Object.values(score));
        const skinType = Object.keys(score).find(key => score[key] === maxScore);
        
        return skinType || 'combination';
    }

    determineSkinTone(responses) {
        const { complexion, sun_reaction, ethnicity } = responses;
        
        let score = { fair: 0, medium: 0, dark: 0 };
        
        // Complexion based scoring
        if (complexion === 'very_fair') score.fair += 3;
        else if (complexion === 'fair') score.fair += 2;
        else if (complexion === 'medium') score.medium += 2;
        else if (complexion === 'olive') score.medium += 1;
        else if (complexion === 'tan') score.dark += 1;
        else if (complexion === 'dark') score.dark += 2;
        else if (complexion === 'very_dark') score.dark += 3;
        
        // Sun reaction adjustment
        if (sun_reaction === 'always_burn') score.fair += 1;
        else if (sun_reaction === 'sometimes_burn') score.medium += 1;
        else if (sun_reaction === 'rarely_burn') score.dark += 1;
        
        const maxScore = Math.max(...Object.values(score));
        return Object.keys(score).find(key => score[key] === maxScore) || 'medium';
    }

    identifyConcerns(responses) {
        const concerns = [];
        const { pores, texture, shine, fine_lines, redness } = responses;
        
        if (pores === 'large' || pores === 'very_large') concerns.push('enlarged pores');
        if (texture === 'rough' || texture === 'uneven') concerns.push('uneven texture');
        if (shine === 'always' || shine === 'often') concerns.push('excess shine');
        if (fine_lines === 'visible' || fine_lines === 'many') concerns.push('fine lines');
        if (redness === 'frequent' || redness === 'constant') concerns.push('redness');
        
        return concerns;
    }

    determineClimate(responses) {
        const { humidity, temperature, pollution } = responses;
        
        let climate = 'moderate';
        if (humidity === 'high' || temperature === 'hot') climate = 'tropical';
        else if (humidity === 'low' || temperature === 'cold') climate = 'dry';
        else if (pollution === 'high') climate = 'urban';
        
        return climate;
    }

    analyzeLifestyle(responses) {
        const { outdoor_time, makeup_use, exercise_frequency } = responses;
        
        const lifestyle = {
            outdoor_level: outdoor_time,
            makeup_heavy: makeup_use === 'daily',
            active: exercise_frequency === 'daily' || exercise_frequency === 'frequent'
        };
        
        return lifestyle;
    }

    calculateConfidence(analysis, responses) {
        // Simple confidence calculation based on answer consistency
        let confidence = 0.7; // Base confidence
        
        const { certainty_level } = responses;
        if (certainty_level === 'very_certain') confidence += 0.2;
        else if (certainty_level === 'certain') confidence += 0.1;
        else if (certainty_level === 'uncertain') confidence -= 0.1;
        
        return Math.min(0.95, Math.max(0.5, confidence));
    }

    recommendProducts(analysis) {
        const { skin_type, skin_tone, concerns, climate } = analysis;
        
        // Find matching products
        const recommendations = this.products.filter(product => {
            // Primary skin type match
            const skinTypeMatch = product.skin_types.includes(skin_type);
            
            // Skin tone compatibility
            const toneMatch = product.skin_tones.includes(skin_tone);
            
            // Concern matching
            const concernMatch = concerns.some(concern => 
                product.benefits.some(benefit => 
                    benefit.toLowerCase().includes(concern.toLowerCase())
                )
            );
            
            // Climate suitability
            const climateMatch = product.climate_suitability.includes(climate) || 
                                product.climate_suitability.includes('moderate');
            
            return skinTypeMatch && toneMatch && (concernMatch || climateMatch);
        });
        
        // Sort by relevance score
        return recommendations.map(product => ({
            ...product,
            relevance_score: this.calculateRelevanceScore(product, analysis),
            match_reason: this.getMatchReason(product, analysis)
        })).sort((a, b) => b.relevance_score - a.relevance_score);
    }

    calculateRelevanceScore(product, analysis) {
        let score = 0;
        
        // Primary skin type match (highest weight)
        if (product.skin_types.includes(analysis.skin_type)) score += 40;
        
        // Skin tone match
        if (product.skin_tones.includes(analysis.skin_tone)) score += 20;
        
        // Concern matching
        const concernMatches = analysis.concerns.filter(concern =>
            product.benefits.some(benefit =>
                benefit.toLowerCase().includes(concern.toLowerCase())
            )
        ).length;
        score += concernMatches * 10;
        
        // Climate suitability
        if (product.climate_suitability.includes(analysis.climate)) score += 15;
        else if (product.climate_suitability.includes('moderate')) score += 10;
        
        // SPF appropriateness
        const datasetEntry = this.skinDataset.find(entry =>
            entry.skin_type === analysis.skin_type && entry.skin_tone === analysis.skin_tone
        );
        if (datasetEntry && Math.abs(product.spf - datasetEntry.recommended_spf) <= 10) score += 15;
        
        return score;
    }

    getMatchReason(product, analysis) {
        const reasons = [];
        
        if (product.skin_types.includes(analysis.skin_type)) {
            reasons.push(`Perfect for ${analysis.skin_type} skin`);
        }
        
        if (product.skin_tones.includes(analysis.skin_tone)) {
            reasons.push(`Ideal for ${analysis.skin_tone} skin tones`);
        }
        
        analysis.concerns.forEach(concern => {
            if (product.benefits.some(benefit => 
                benefit.toLowerCase().includes(concern.toLowerCase()))) {
                reasons.push(`Addresses ${concern}`);
            }
        });
        
        return reasons.join(', ');
    }

    generatePersonalizedRecommendations(analysis) {
        const recommendations = this.recommendProducts(analysis);
        const top3 = recommendations.slice(0, 3);
        
        return {
            primary: top3[0] || null,
            secondary: top3.slice(1),
            alternatives: recommendations.slice(3),
            total_products: recommendations.length,
            analysis_summary: this.generateAnalysisSummary(analysis),
            personalized_tips: this.generatePersonalizedTips(analysis)
        };
    }

    generateAnalysisSummary(analysis) {
        const { skin_type, skin_tone, concerns, climate, confidence } = analysis;
        
        return {
            profile: `${skin_tone} ${skin_type} skin`,
            key_concerns: concerns.slice(0, 3),
            spf_recommendation: this.getSPFRecommendation(skin_type, climate),
            confidence_description: this.getConfidenceDescription(confidence)
        };
    }

    generatePersonalizedTips(analysis) {
        const tips = [];
        const { skin_type, concerns, climate } = analysis;
        
        // Skin type specific tips
        if (skin_type === 'oily') {
            tips.push('Use oil-free products and blot papers throughout the day');
            tips.push('Look for "non-comedogenic" on product labels');
        } else if (skin_type === 'dry') {
            tips.push('Apply moisturizer while skin is still damp');
            tips.push('Use humidifier in dry environments');
        } else if (skin_type === 'combination') {
            tips.push('Use different products for T-zone and cheeks');
            tips.push('Consider multi-masking routines');
        } else if (skin_type === 'acne') {
            tips.push('Introduce products gradually to avoid irritation');
            tips.push('Avoid harsh scrubs and over-washing');
        }
        
        // Climate specific tips
        if (climate === 'tropical') {
            tips.push('Reapply sunscreen every 2-3 hours');
            tips.push('Use water-resistant formulas');
        } else if (climate === 'dry') {
            tips.push('Use richer moisturizers at night');
            tips.push('Protect skin from wind and cold');
        }
        
        return tips;
    }

    getSPFRecommendation(skin_type, climate) {
        if (climate === 'tropical' || climate === 'hot') return 'SPF 50+';
        if (skin_type === 'dry' && climate === 'moderate') return 'SPF 30';
        return 'SPF 50+';
    }

    getConfidenceDescription(confidence) {
        if (confidence >= 0.9) return 'Very High';
        if (confidence >= 0.8) return 'High';
        if (confidence >= 0.7) return 'Medium';
        return 'Low';
    }

    // Save user profile
    saveUserProfile(profile) {
        this.userProfile = profile;
        localStorage.setItem('solara_skin_profile', JSON.stringify(profile));
        
        // Track analysis for analytics
        this.trackAnalysis(profile);
    }

    loadUserProfile() {
        const saved = localStorage.getItem('solara_skin_profile');
        if (saved) {
            this.userProfile = JSON.parse(saved);
            return this.userProfile;
        }
        return null;
    }

    trackAnalysis(profile) {
        // In a real implementation, this would send to analytics
        console.log('Skin Analysis Tracked:', {
            skin_type: profile.skin_type,
            skin_tone: profile.skin_tone,
            concerns: profile.concerns,
            timestamp: new Date().toISOString()
        });
    }
}

// Export for global use
window.SkinAnalyzer = SkinAnalyzer;
