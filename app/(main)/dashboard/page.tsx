'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Plus,
    Search,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    Copy,
    Share2,
    FileText,
    Calendar,
    Users,
    TrendingUp,
    Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Form {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'draft' | 'archived';
    responses: number;
    views: number;
    createdAt: string;
    updatedAt: string;
}

const FormsDashboard = () => {

    const router = useRouter()

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
    const [forms, setForms] = useState<Form[]>([
        {
            id: '1',
            title: 'Customer Feedback Survey',
            description: 'Collect valuable feedback from our customers',
            status: 'active',
            responses: 245,
            views: 1023,
            createdAt: '2025-01-10',
            updatedAt: '2025-01-15'
        },
        {
            id: '2',
            title: 'Employee Satisfaction Survey',
            description: 'Annual employee satisfaction and engagement survey',
            status: 'active',
            responses: 89,
            views: 156,
            createdAt: '2025-01-08',
            updatedAt: '2025-01-14'
        },
        {
            id: '3',
            title: 'Event Registration Form',
            description: 'Register for our upcoming tech conference',
            status: 'draft',
            responses: 0,
            views: 12,
            createdAt: '2025-01-12',
            updatedAt: '2025-01-16'
        },
        {
            id: '4',
            title: 'Product Feedback Form',
            description: 'Share your thoughts on our new product features',
            status: 'active',
            responses: 532,
            views: 2145,
            createdAt: '2024-12-20',
            updatedAt: '2025-01-10'
        },
        {
            id: '5',
            title: 'Job Application Form',
            description: 'Apply for open positions at our company',
            status: 'archived',
            responses: 167,
            views: 891,
            createdAt: '2024-11-05',
            updatedAt: '2024-12-30'
        },
        {
            id: '6',
            title: 'Newsletter Subscription',
            description: 'Subscribe to our weekly newsletter',
            status: 'active',
            responses: 1203,
            views: 3456,
            createdAt: '2024-10-15',
            updatedAt: '2025-01-12'
        }
    ]);

    const getStatusColor = (status: Form['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/10 text-green-600 hover:bg-green-500/20';
            case 'draft':
                return 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20';
            case 'archived':
                return 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20';
            default:
                return 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20';
        }
    };

    const filteredForms = forms.filter(form => {
        const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            form.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || form.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        totalForms: forms.length,
        activeForms: forms.filter(f => f.status === 'active').length,
        totalResponses: forms.reduce((acc, form) => acc + form.responses, 0),
        totalViews: forms.reduce((acc, form) => acc + form.views, 0)
    };

    const handleDelete = (id: string) => {
        setForms(forms.filter(form => form.id !== id));
    };

    const handleDuplicate = (form: Form) => {
        const newForm: Form = {
            ...form,
            id: Date.now().toString(),
            title: `${form.title} (Copy)`,
            responses: 0,
            views: 0,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
        setForms([newForm, ...forms]);
    };

    const handleStatusChange = (id: string, newStatus: Form['status']) => {
        setForms(forms.map(form =>
            form.id === id ? { ...form, status: newStatus } : form
        ));
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-card">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
                            <p className="text-muted-foreground mt-1">Manage and track all your forms in one place</p>
                        </div>
                        <Button onClick={() => router.push("/create")} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Create New Form
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Forms</p>
                                        <p className="text-2xl font-bold mt-1">{stats.totalForms}</p>
                                    </div>
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Active Forms</p>
                                        <p className="text-2xl font-bold mt-1">{stats.activeForms}</p>
                                    </div>
                                    <div className="p-3 bg-green-500/10 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Responses</p>
                                        <p className="text-2xl font-bold mt-1">{stats.totalResponses.toLocaleString()}</p>
                                    </div>
                                    <div className="p-3 bg-blue-500/10 rounded-lg">
                                        <Users className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Views</p>
                                        <p className="text-2xl font-bold mt-1">{stats.totalViews.toLocaleString()}</p>
                                    </div>
                                    <div className="p-3 bg-purple-500/10 rounded-lg">
                                        <Eye className="w-5 h-5 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-6">
                {/* Search and Filter Bar */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search forms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Filter className="w-4 h-4" />
                                {filterStatus === 'all' ? 'All Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                                All Status
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                                Active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus('draft')}>
                                Draft
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus('archived')}>
                                Archived
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Forms Grid */}
                {filteredForms.length === 0 ? (
                    <Card className="p-12">
                        <div className="text-center">
                            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No forms found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating your first form'}
                            </p>
                            {!searchQuery && (
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Create New Form
                                </Button>
                            )}
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredForms.map((form) => (
                            <Card key={form.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <Badge className={getStatusColor(form.status)}>
                                            {form.status}
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2">
                                                    <Eye className="w-4 h-4" />
                                                    View Responses
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2">
                                                    <Edit className="w-4 h-4" />
                                                    Edit Form
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2" onClick={() => handleDuplicate(form)}>
                                                    <Copy className="w-4 h-4" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2">
                                                    <Share2 className="w-4 h-4" />
                                                    Share
                                                </DropdownMenuItem>
                                                {form.status === 'active' && (
                                                    <DropdownMenuItem className="gap-2" onClick={() => handleStatusChange(form.id, 'archived')}>
                                                        Archive
                                                    </DropdownMenuItem>
                                                )}
                                                {form.status === 'draft' && (
                                                    <DropdownMenuItem className="gap-2" onClick={() => handleStatusChange(form.id, 'active')}>
                                                        Publish
                                                    </DropdownMenuItem>
                                                )}
                                                {form.status === 'archived' && (
                                                    <DropdownMenuItem className="gap-2" onClick={() => handleStatusChange(form.id, 'active')}>
                                                        Restore
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(form.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <CardTitle className="text-xl">{form.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{form.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Users className="w-4 h-4" />
                                                <span>{form.responses} responses</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Eye className="w-4 h-4" />
                                                <span>{form.views} views</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            <span>Updated {form.updatedAt}</span>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Button variant="outline" className="flex-1 gap-2" size="sm">
                                                <Eye className="w-4 h-4" />
                                                View
                                            </Button>
                                            <Button className="flex-1 gap-2" size="sm">
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormsDashboard;