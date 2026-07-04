import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Stack,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { AppInput } from '../components/ui/AppInput';
import { AppSelect } from '../components/ui/AppSelect';
import { AppButton } from '../components/ui/AppButton';
import { SEO } from '../components/seo/SEO';
import { jobApi, JobCategoryData, JobTypeData } from '../features/jobs/services/jobApi';
import { companyApi, CompanyData } from '../features/company/services/companyApi';

const EXPERIENCE_LEVELS = [
  { label: 'Entry Level', value: 'ENTRY_LEVEL' },
  { label: 'Junior', value: 'JUNIOR' },
  { label: 'Mid-Level', value: 'MID_LEVEL' },
  { label: 'Senior', value: 'SENIOR' },
  { label: 'Lead', value: 'LEAD' },
  { label: 'Executive', value: 'EXECUTIVE' },
];

const SALARY_TYPES = [
  { label: 'Hourly', value: 'HOURLY' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Yearly', value: 'YEARLY' },
  { label: 'Commission', value: 'COMMISSION' },
  { label: 'Negotiable', value: 'NEGOTIABLE' },
];

const REMOTE_OPTIONS = [
  { label: 'Remote', value: 'REMOTE' },
  { label: 'Hybrid', value: 'HYBRID' },
  { label: 'On-Site', value: 'ON_SITE' },
];

const jobFormSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  description: z.string().min(10, 'Job description must be at least 10 characters'),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  qualifications: z.string().optional(),
  category: z.string().min(1, 'Please select a job category'),
  employmentType: z.string().min(1, 'Please select an employment type'),
  experienceLevel: z.enum(['ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'EXECUTIVE']),
  salaryType: z.enum(['HOURLY', 'MONTHLY', 'YEARLY', 'COMMISSION', 'NEGOTIABLE']),
  minimumSalary: z.coerce.number().optional(),
  maximumSalary: z.coerce.number().optional(),
  currency: z.string().min(1, 'Currency is required'),
  salaryVisibility: z.enum(['PUBLIC', 'PRIVATE']),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  state: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters'),
  remoteOption: z.enum(['REMOTE', 'HYBRID', 'ON_SITE']),
  vacancies: z.coerce.number().int().positive(),
  applicationDeadline: z.string().optional(),
  company: z.string().min(1, 'Please select a company'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED']),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export function JobPostPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<JobCategoryData[]>([]);
  const [types, setTypes] = useState<JobTypeData[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      description: '',
      responsibilities: '',
      requirements: '',
      qualifications: '',
      category: '',
      employmentType: '',
      experienceLevel: 'ENTRY_LEVEL',
      salaryType: 'NEGOTIABLE',
      minimumSalary: undefined,
      maximumSalary: undefined,
      currency: 'USD',
      salaryVisibility: 'PUBLIC',
      country: '',
      state: '',
      city: '',
      remoteOption: 'ON_SITE',
      vacancies: 1,
      applicationDeadline: '',
      company: '',
      status: 'PUBLISHED',
    },
  });

  const selectedSalaryType = watch('salaryType');

  useEffect(() => {
    async function init() {
      try {
        const [catsData, typesData, companiesData] = await Promise.all([
          jobApi.getCategories(),
          jobApi.getJobTypes(),
          companyApi.getMyCompanies(),
        ]);
        setCategories(catsData);
        setTypes(typesData);
        setCompanies(companiesData);

        if (id) {
          const job = await jobApi.getJobDetails(id);
          reset({
            title: job.title,
            description: job.description,
            responsibilities: job.responsibilities || '',
            requirements: job.requirements || '',
            qualifications: job.qualifications || '',
            category: job.category,
            employmentType: job.employmentType,
            experienceLevel: job.experienceLevel,
            salaryType: job.salaryType,
            minimumSalary: job.minimumSalary,
            maximumSalary: job.maximumSalary,
            currency: job.currency,
            salaryVisibility: job.salaryVisibility,
            country: job.country,
            state: job.state || '',
            city: job.city,
            remoteOption: job.remoteOption,
            vacancies: job.vacancies || 1,
            applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
            company: job.company?._id || '',
            status: job.status,
          });
        }
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } } };
        setErrorMessage(ax.response?.data?.message || 'Failed to initialize form.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id, reset]);

  const onSubmit = async (values: JobFormValues) => {
    setSaving(true);
    setErrorMessage(null);
    try {
      if (id) {
        await jobApi.updateJob(id, values as never);
      } else {
        await jobApi.createJob(values as never);
      }
      navigate('/company/dashboard');
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setErrorMessage(ax.response?.data?.message || 'Failed to save job posting.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (companies.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <SEO title="No Company Found | TrusonHub" description="Create a company first" />
        <Alert severity="warning" variant="filled">
          You must create a Company profile before you can post a job. Go to the Employer Dashboard to setup your company profile.
        </Alert>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <AppButton onClick={() => navigate('/company/dashboard')} variant="primary">
            Go to Employer Dashboard
          </AppButton>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <SEO
        title={id ? 'Edit Job Posting | TrusonHub' : 'Post a New Job | TrusonHub'}
        description="Advertise your job opening to thousands of developers and professionals on TrusonHub."
      />
      <Typography variant="h4" fontWeight={800} gutterBottom>
        {id ? 'Edit Job Opening' : 'Post a New Job'}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Fill out the details below to advertise your job opening. Slugs are auto-generated dynamically.
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider', mb: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            1. Job Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <AppInput
                    {...field}
                    label="Job Title"
                    placeholder="e.g. Senior Full Stack Developer"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <AppSelect
                    {...field}
                    label="Posting Company"
                    options={companies.map((c) => ({ label: c.name, value: c._id }))}
                    error={!!errors.company}
                    helperText={errors.company?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <AppSelect
                    {...field}
                    label="Job Category"
                    options={categories.map((c) => ({ label: c.name, value: c.slug }))}
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="employmentType"
                control={control}
                render={({ field }) => (
                  <AppSelect
                    {...field}
                    label="Employment Type"
                    options={types.map((t) => ({ label: t.name, value: t.slug }))}
                    error={!!errors.employmentType}
                    helperText={errors.employmentType?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="experienceLevel"
                control={control}
                render={({ field }) => (
                  <AppSelect
                    {...field}
                    label="Experience Level"
                    options={EXPERIENCE_LEVELS}
                    error={!!errors.experienceLevel}
                    helperText={errors.experienceLevel?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider', mb: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            2. Detailed Descriptions
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <AppInput
                    {...field}
                    type="textarea"
                    label="Job Description"
                    placeholder="Describe the overall mission, role, and general context of the position."
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="responsibilities"
                control={control}
                render={({ field }) => (
                  <AppInput
                    {...field}
                    type="textarea"
                    label="Responsibilities (Optional)"
                    placeholder="List core responsibilities/duties of the candidate."
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="requirements"
                control={control}
                render={({ field }) => (
                  <AppInput
                    {...field}
                    type="textarea"
                    label="Requirements (Optional)"
                    placeholder="List required technical skills, years of experience, tools."
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="qualifications"
                control={control}
                render={({ field }) => (
                  <AppInput
                    {...field}
                    type="textarea"
                    label="Qualifications (Optional)"
                    placeholder="List degrees, certifications, or licenses required."
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider', mb: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            3. Compensation & Location
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="salaryType"
                control={control}
                render={({ field }) => (
                  <AppSelect
                    {...field}
                    label="Salary Type"
                    options={SALARY_TYPES}
                    error={!!errors.salaryType}
                    helperText={errors.salaryType?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="minimumSalary"
                control={control}
                render={({ field }) => (
                  <AppInput
                    {...field}
                    label="Minimum Salary"
                    disabled={selectedSalaryType === 'NEGOTIABLE'}
                    error={!!errors.minimumSalary}
                    helperText={errors.minimumSalary?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="maximumSalary"
                control={control}
                render={({ field }) => (
                  <AppInput
                    {...field}
                    label="Maximum Salary"
                    disabled={selectedSalaryType === 'NEGOTIABLE'}
                    error={!!errors.maximumSalary}
                    helperText={errors.maximumSalary?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <AppInput
                    {...field}
                    label="Country"
                    placeholder="e.g. United States"
                    error={!!errors.country}
                    helperText={errors.country?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <AppInput
                    {...field}
                    label="City"
                    placeholder="e.g. San Francisco"
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="remoteOption"
                control={control}
                render={({ field }) => (
                  <AppSelect
                    {...field}
                    label="Workplace Setting"
                    options={REMOTE_OPTIONS}
                    error={!!errors.remoteOption}
                    helperText={errors.remoteOption?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="vacancies"
                control={control}
                render={({ field }) => (
                  <AppInput
                    {...field}
                    label="Number of Vacancies"
                    error={!!errors.vacancies}
                    helperText={errors.vacancies?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider', mb: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            4. Post Status
          </Typography>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>Job Status Mode</FormLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <RadioGroup row {...field}>
                  <FormControlLabel value="PUBLISHED" control={<Radio />} label="Publish Instantly" />
                  <FormControlLabel value="DRAFT" control={<Radio />} label="Save as Draft" />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Paper>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <AppButton variant="ghost" size="large" onClick={() => navigate('/company/dashboard')}>
            Cancel
          </AppButton>
          <AppButton type="submit" variant="primary" size="large" isLoading={saving}>
            {id ? 'Update Posting' : 'Post Job'}
          </AppButton>
        </Stack>
      </form>
    </Container>
  );
}
