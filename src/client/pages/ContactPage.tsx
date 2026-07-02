import { useState } from 'react';
import { Box, Container, Typography, Stack, Grid, Paper, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import { AppInput } from '../components/ui/AppInput';
import { AppAlert } from '../components/feedback/AppAlert';
import { SEO } from '../components/seo/SEO';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <SEO title="Contact Us — TrusonHub Job Searcher" description="Get in touch with our support and enterprise sales teams." />

      <Box sx={{ py: 8, textAlign: 'center', bgcolor: 'background.surface', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} sx={{ mb: 2 }}>
            Get in Touch
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
            Have a question, feedback, or need enterprise support? Our team is here to help 24/7.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
              Contact Information
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
              Reach out via email, phone, or visit our headquarters. We respond to all inquiries within 24 hours.
            </Typography>

            <Stack spacing={3} sx={{ mb: 6 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Paper sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'primary.50', color: 'primary.main' }}>
                  <EmailIcon />
                </Paper>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Email Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    support@trusonhub.com
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Paper sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'primary.50', color: 'primary.main' }}>
                  <PhoneIcon />
                </Paper>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Phone Line
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +1 (800) 555-TRUSON
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Paper sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'primary.50', color: 'primary.main' }}>
                  <LocationOnIcon />
                </Paper>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Headquarters
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    500 Market Street, Suite 800, San Francisco, CA 94105
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            {/* Map Placeholder */}
            <Paper
              sx={{
                height: 200,
                borderRadius: '16px',
                bgcolor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                [ Interactive Map Location Placeholder ]
              </Typography>
            </Paper>
          </Grid>

          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px' }}>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
                Send Us a Message
              </Typography>

              {submitted ? (
                <AppAlert severity="success" title="Message Sent Successfully!">
                  Thank you for contacting TrusonHub. One of our support representatives will get back to you shortly.
                </AppAlert>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <AppInput label="First Name" required fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <AppInput label="Last Name" required fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <AppInput type="email" label="Email Address" required fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <AppInput label="Subject" required fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <AppInput type="textarea" label="Your Message" rows={5} required fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<SendIcon />}
                        sx={{ py: 1.5, px: 4, borderRadius: '12px', fontWeight: 700 }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
