import { describe, it, expect } from 'vitest';
import { calculateProfileCompletion } from '../../../src/server/services/profileCompletionEngine';

describe('Profile Completion Engine Unit Tests', () => {
  it('calculates 0% completion for empty profile', () => {
    const result = calculateProfileCompletion({
      hasPhoto: false,
      headline: '',
      about: '',
      experienceCount: 0,
      educationCount: 0,
      skillsCount: 0,
      hasResume: false,
      portfolioCount: 0,
    });

    expect(result.score).toBe(0);
    expect(result.level).toBe('Beginner');
    expect(result.recommendations.length).toBe(7);
  });

  it('calculates 100% completion for complete candidate profile', () => {
    const result = calculateProfileCompletion({
      hasPhoto: true,
      headline: 'Senior Full Stack Engineer',
      about: 'Experienced developer specializing in React, Node.js, and Cloud Infrastructure.',
      experienceCount: 3,
      educationCount: 1,
      skillsCount: 5,
      hasResume: true,
      portfolioCount: 2,
    });

    expect(result.score).toBe(100);
    expect(result.level).toBe('All-Star');
    expect(result.recommendations.length).toBe(0);
    expect(result.breakdown.photo).toBe(true);
    expect(result.breakdown.resume).toBe(true);
  });

  it('calculates partial score and returns specific improvement recommendations', () => {
    const result = calculateProfileCompletion({
      hasPhoto: true, // 10
      headline: 'DevOps Engineer',
      about: 'Kubernetes specialist', // 15
      experienceCount: 1, // 20
      educationCount: 0,
      skillsCount: 4, // 15
      hasResume: false,
      portfolioCount: 0,
    });

    expect(result.score).toBe(60);
    expect(result.level).toBe('Intermediate');
    expect(result.recommendations).toContain('Upload your PDF/DOC resume (+15%)');
    expect(result.recommendations).toContain('Add your academic education background (+15%)');
  });
});
