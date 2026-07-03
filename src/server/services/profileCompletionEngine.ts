export interface ProfileCompletionResult {
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All-Star';
  breakdown: {
    photo: boolean;
    headlineAndAbout: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    resume: boolean;
    portfolio: boolean;
  };
  recommendations: string[];
}

export function calculateProfileCompletion(data: {
  hasPhoto: boolean;
  headline?: string;
  about?: string;
  experienceCount: number;
  educationCount: number;
  skillsCount: number;
  hasResume: boolean;
  portfolioCount: number;
}): ProfileCompletionResult {
  let score = 0;
  const recommendations: string[] = [];

  const breakdown = {
    photo: data.hasPhoto,
    headlineAndAbout: Boolean(data.headline && data.headline.trim() && data.about && data.about.trim()),
    experience: data.experienceCount > 0,
    education: data.educationCount > 0,
    skills: data.skillsCount >= 3,
    resume: data.hasResume,
    portfolio: data.portfolioCount > 0,
  };

  if (breakdown.photo) score += 10;
  else recommendations.push('Upload a professional profile photo (+10%)');

  if (breakdown.headlineAndAbout) score += 15;
  else recommendations.push('Add a professional headline and summary (+15%)');

  if (breakdown.experience) score += 20;
  else recommendations.push('Add at least 1 work experience entry (+20%)');

  if (breakdown.education) score += 15;
  else recommendations.push('Add your academic education background (+15%)');

  if (breakdown.skills) score += 15;
  else recommendations.push('Add at least 3 professional skills (+15%)');

  if (breakdown.resume) score += 15;
  else recommendations.push('Upload your PDF/DOC resume (+15%)');

  if (breakdown.portfolio) score += 10;
  else recommendations.push('Add a project portfolio item (+10%)');

  let level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All-Star' = 'Beginner';
  if (score >= 90) level = 'All-Star';
  else if (score >= 70) level = 'Advanced';
  else if (score >= 40) level = 'Intermediate';

  return {
    score: Math.min(score, 100),
    level,
    breakdown,
    recommendations,
  };
}
