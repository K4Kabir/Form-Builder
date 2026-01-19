'use client'

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

interface FormField {
    id: string;
    type: string;
    label: string;
    order: number;
    required: boolean;
    placeholder: string;
    options?: string[];
}

interface FormData {
    id: string;
    userId: string;
    createdAt: string;
    published: boolean;
    title: string;
    description: string;
    shareUrl: string;
    status: string;
    content: FormField[];
}

const FormFieldSkeleton = () => (
    <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
    </div>
);

const FormSubmissionPage = () => {
    const [formData, setFormData] = useState<FormData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams()

    useEffect(() => {
        getDraftData();
    }, []);

    const getDraftData = async function () {
        if (!id) return
        setIsLoading(true)
        try {
            let response = await axios.post('/api/getDraftPostData', { id: id })

            console.log(response.data)

            if (response.data) {
                setFormData(response.data);
            }
        } catch (error) {
            toast.error("Something went wrong")
            setError("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    // Build dynamic Zod schema based on form fields
    const buildValidationSchema = (fields: FormField[]) => {
        const schemaFields: Record<string, z.ZodTypeAny> = {};

        fields.forEach(field => {
            let fieldSchema: z.ZodTypeAny;

            switch (field.type) {
                case 'email':
                    fieldSchema = field.required
                        ? z.string().min(1, `${field.label} is required`).email('Invalid email address')
                        : z.union([z.string().email('Invalid email address'), z.literal('')]).optional();
                    break;

                case 'number':
                    fieldSchema = field.required
                        ? z.string().min(1, `${field.label} is required`)
                        : z.union([z.string(), z.literal('')]).optional();
                    break;

                case 'checkbox':
                    fieldSchema = field.required
                        ? z.boolean().refine(val => val === true, {
                            message: `${field.label} must be checked`
                        })
                        : z.boolean().optional();
                    break;

                case 'date':
                    fieldSchema = field.required
                        ? z.string().min(1, `${field.label} is required`)
                        : z.union([z.string(), z.literal('')]).optional();
                    break;

                case 'select':
                case 'radio':
                    fieldSchema = field.required
                        ? z.string().min(1, `${field.label} is required`)
                        : z.union([z.string(), z.literal('')]).optional();
                    break;

                case 'textarea':
                case 'text':
                default:
                    fieldSchema = field.required
                        ? z.string().min(1, `${field.label} is required`)
                        : z.union([z.string(), z.literal('')]).optional();
                    break;
            }

            schemaFields[field.id] = fieldSchema;
        });

        return z.object(schemaFields);
    };

    // Build default values based on form fields
    const getDefaultValues = () => {
        if (!formData) return {};

        return formData.content.reduce((acc, field) => {
            acc[field.id] = field.type === 'checkbox' ? false : '';
            return acc;
        }, {} as Record<string, any>);
    };

    const validationSchema = formData ? buildValidationSchema(formData.content) : z.object({});

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: zodResolver(validationSchema) as any,
        defaultValues: getDefaultValues(),
        mode: 'onSubmit'
    });

    const onSubmit = async (data: any) => {
        try {
            // Replace with your actual submission endpoint
            // const response = await fetch(`/api/forms/${shareUrl}/submit`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });

            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Form submitted:', data);
            setIsSubmitted(true);
        } catch (err) {
            setError('Failed to submit form. Please try again.');
        }
    };

    const renderFormField = (field: FormField) => {
        switch (field.type) {
            case 'text':
            case 'email':
            case 'number':
                return (
                    <Controller
                        name={field.id}
                        control={control}
                        render={({ field: controllerField }) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.id} className="flex gap-1">
                                    {field.label}
                                    {field.required && <span className="text-destructive">*</span>}
                                </Label>
                                <Input
                                    {...controllerField}
                                    id={field.id}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    className={errors[field.id] ? 'border-destructive' : ''}
                                    value={controllerField.value || ''}
                                />
                                {errors[field.id] && (
                                    <p className="text-sm text-destructive">
                                        {errors[field.id]?.message as string}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                );

            case 'textarea':
                return (
                    <Controller
                        name={field.id}
                        control={control}
                        render={({ field: controllerField }) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.id} className="flex gap-1">
                                    {field.label}
                                    {field.required && <span className="text-destructive">*</span>}
                                </Label>
                                <Textarea
                                    {...controllerField}
                                    id={field.id}
                                    placeholder={field.placeholder}
                                    rows={4}
                                    className={errors[field.id] ? 'border-destructive' : ''}
                                    value={controllerField.value || ''}
                                />
                                {errors[field.id] && (
                                    <p className="text-sm text-destructive">
                                        {errors[field.id]?.message as string}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                );

            case 'select':
                return (
                    <Controller
                        name={field.id}
                        control={control}
                        render={({ field: controllerField }) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.id} className="flex gap-1">
                                    {field.label}
                                    {field.required && <span className="text-destructive">*</span>}
                                </Label>
                                <Select
                                    value={controllerField.value || ''}
                                    onValueChange={controllerField.onChange}
                                >
                                    <SelectTrigger className={errors[field.id] ? 'border-destructive' : ''}>
                                        <SelectValue placeholder={field.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options?.map((option, idx) => (
                                            <SelectItem
                                                key={idx}
                                                value={option.toLowerCase().replace(/\s+/g, '-')}
                                            >
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors[field.id] && (
                                    <p className="text-sm text-destructive">
                                        {errors[field.id]?.message as string}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                );

            case 'checkbox':
                return (
                    <Controller
                        name={field.id}
                        control={control}
                        render={({ field: controllerField }) => (
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={field.id}
                                        checked={!!controllerField.value}
                                        onChange={controllerField.onChange}
                                        className={`w-4 h-4 ${errors[field.id] ? 'border-destructive' : ''}`}
                                    />
                                    <Label htmlFor={field.id} className="flex gap-1 font-normal cursor-pointer">
                                        {field.label}
                                        {field.required && <span className="text-destructive">*</span>}
                                    </Label>
                                </div>
                                {errors[field.id] && (
                                    <p className="text-sm text-destructive ml-6">
                                        {errors[field.id]?.message as string}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                );

            case 'radio':
                return (
                    <Controller
                        name={field.id}
                        control={control}
                        render={({ field: controllerField }) => (
                            <div className="space-y-2">
                                <Label className="flex gap-1">
                                    {field.label}
                                    {field.required && <span className="text-destructive">*</span>}
                                </Label>
                                <div className="space-y-2">
                                    {field.options?.map((option, idx) => (
                                        <div key={idx} className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id={`${field.id}-${idx}`}
                                                value={option}
                                                checked={controllerField.value === option}
                                                onChange={(e) => controllerField.onChange(e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <Label
                                                htmlFor={`${field.id}-${idx}`}
                                                className="font-normal cursor-pointer"
                                            >
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {errors[field.id] && (
                                    <p className="text-sm text-destructive">
                                        {errors[field.id]?.message as string}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                );

            case 'date':
                return (
                    <Controller
                        name={field.id}
                        control={control}
                        render={({ field: controllerField }) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.id} className="flex gap-1">
                                    {field.label}
                                    {field.required && <span className="text-destructive">*</span>}
                                </Label>
                                <Input
                                    {...controllerField}
                                    id={field.id}
                                    type="date"
                                    className={errors[field.id] ? 'border-destructive' : ''}
                                    value={controllerField.value || ''}
                                />
                                {errors[field.id] && (
                                    <p className="text-sm text-destructive">
                                        {errors[field.id]?.message as string}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                );

            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-muted/30 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <Skeleton className="h-8 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {Array.from({ length: 5 }).map((_, idx) => (
                                <FormFieldSkeleton key={idx} />
                            ))}
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error && !formData) {
        return (
            <div className="min-h-screen bg-muted/30 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <Card className="shadow-lg">
                        <CardContent className="py-12">
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                            <Button
                                onClick={getDraftData}
                                className="mt-4 w-full"
                                variant="outline"
                            >
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-muted/30 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <Card className="shadow-lg">
                        <CardContent className="py-12 text-center">
                            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                            <p className="text-muted-foreground mb-6">
                                Your response has been submitted successfully.
                            </p>
                            <Button onClick={() => {
                                setIsSubmitted(false);
                                reset();
                            }}>
                                Submit Another Response
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">{formData?.title}</CardTitle>
                        <CardDescription>{formData?.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {formData?.content
                                .sort((a, b) => a.order - b.order)
                                .map((field) => (
                                    <div key={field.id}>
                                        {renderFormField(field)}
                                    </div>
                                ))}

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 h-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                onClick={handleSubmit(onSubmit)}
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FormSubmissionPage;