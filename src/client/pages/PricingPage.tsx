import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Stack, Grid, ToggleButtonGroup, ToggleButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PricingCard } from '../components/cards/PricingCard';
import { SEO } from '../components/seo/SEO';

const PRICING_PLANS = [
  {
    title: 'Free',
    price: '$0',
    description: 'Perfect for candidates exploring career options and job postings.',
    features: ['Create candidate profile', 'Browse 50,000+ job listings', 'Basic job alerts', 'Apply to 5 jobs/month'],
  },
  {
    title: 'Starter',
    price: '$49',
    description: 'Ideal for small startups & boutique agencies looking to hire fast.',
    features: ['1 Active Job Posting', 'Standard Search Placement', 'Access candidate applications', 'Email Support', '30-day posting duration'],
  },
  {
    title: 'Professional',
    price: '$149',
    description: 'Designed for growing tech teams and active hiring managers.',
    features: ['5 Active Job Postings', 'Featured Search Highlight', 'AI Candidate Pre-screening', 'Priority Support', 'Employer Branding Badge', '60-day posting duration'],
    popular: true,
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    description: 'Custom talent acquisition solutions for global organizations.',
    features: ['Unlimited Job Postings', 'Dedicated Account Manager', 'Custom ATS Integration', '24/7 Phone & SLA Support', 'Global Sourcing Campaigns', 'Full API Access'],
  },
];

const FAQS = [
  {
    q: 'Can I change my plan at any time?',
    a: 'Yes, you can upgrade, downgrade, or cancel your subscription plan at any time directly from your employer portal dashboard.',
  },
  {
    q: 'What payment methods do you support?',
    a: 'We support all major credit cards (Visa, Mastercard, American Express), PayPal, and direct ACH invoice billing for Enterprise plans.',
  },
  {
    q: 'Is there a free trial for employer accounts?',
    a: 'Yes! All new employer accounts receive a 14-day free trial of the Starter plan with zero commitment.',
  },
  {
    q: 'How long do job postings remain active?',
    a: 'Postings stay live for 30 to 60 days depending on your subscription tier, and can be renewed or refreshed at any time.',
  },
];

export function PricingPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <>
      <SEO title="Pricing & Subscription Plans — Talentra" description="Flexible pricing for job seekers and hiring employers." />

      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} sx={{ mb: 2 }}>
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.125rem' }}>
            Choose the plan that fits your hiring velocity. No hidden fees.
          </Typography>

          <ToggleButtonGroup
            value={billingCycle}
            exclusive
            onChange={(_, val) => val && setBillingCycle(val)}
            sx={{ bgcolor: 'background.paper', p: 0.5, borderRadius: '12px' }}
          >
            <ToggleButton value="monthly" sx={{ px: { xs: 1.5, sm: 3 }, py: 1, borderRadius: '10px', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Monthly Billing
            </ToggleButton>
            <ToggleButton value="annual" sx={{ px: { xs: 1.5, sm: 3 }, py: 1, borderRadius: '10px', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Annual (Save 20%)
            </ToggleButton>
          </ToggleButtonGroup>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pb: 10 }}>
        <Grid container spacing={3} alignItems="stretch" sx={{ mb: 10 }}>
          {PRICING_PLANS.map((plan, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
              <PricingCard
                {...plan}
                onClick={() => {
                  if (plan.title === 'Free') {
                    navigate('/auth/register/job-seeker');
                  } else {
                    navigate('/auth/register/employer');
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>

        {/* FAQ Section */}
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={800} textAlign="center" sx={{ mb: 4 }}>
            Frequently Asked Questions
          </Typography>
          <Stack spacing={2}>
            {FAQS.map((faq, idx) => (
              <Accordion key={idx} sx={{ borderRadius: '12px', overflow: 'hidden', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Container>
      </Container>
    </>
  );
}
