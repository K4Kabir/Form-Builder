'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Type, Hash, Mail, CheckSquare, Circle, AlignLeft, Calendar, MousePointerClick,
    Trash2, GripVertical, ChevronLeft, Copy
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { Spinner } from '../ui/spinner';
import axios from 'axios'
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';

interface FormElement {
    id: string;
    type: string;
    label: string;
    placeholder: string;
    required: boolean;
    order: number;
    options?: string[];
}

interface ComponentType {
    type: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
}

const FormBuilder = () => {
    const [title, setFormTitle] = useState('Customer Feedback Survey');
    const [description, setFormDescription] = useState('Please share your thoughts with us');
    const [formElements, setFormElements] = useState<FormElement[]>([]);
    const [selectedElement, setSelectedElement] = useState<FormElement | null>(null);
    const [draggedItem, setDraggedItem] = useState<FormElement | null>(null);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [saving, setSaving] = useState<boolean>(false)
    const session = useSession()
    const router = useRouter();
    const { id } = useParams();


    const getDraftData = async function () {
        if (!id) return
        try {
            let response = await axios.post('/api/getDraftPostData', { id: id })

            if (response) {
                setFormElements(response.data.content);
                setFormTitle(response.data.title)
                setFormDescription(response.data.description)
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {

        }
    }


    const saveForm = async function (type: string) {
        try {
            setSaving(true)
            const response = await axios.post('/api/createForm', {
                id: id ?? undefined,
                userId: session.data?.user.id,
                title,
                description,
                content: [...formElements]
            })

            if (response) {
                router.push(`/create/${response.data.id}`)
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setSaving(false)
        }
    }


    useEffect(() => {

        getDraftData()
    }, [])


    const componentTypes: ComponentType[] = [
        { type: 'text', icon: Type, label: 'Name' },
        { type: 'email', icon: Mail, label: 'Email' },
        { type: 'text', icon: Type, label: 'Address' },
        { type: 'textarea', icon: AlignLeft, label: 'Single Line' },
        { type: 'textarea', icon: AlignLeft, label: 'Multi Line' },
        { type: 'number', icon: Hash, label: 'Number' },
        { type: 'select', icon: CheckSquare, label: 'Dropdown' },
        { type: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
        { type: 'radio', icon: Circle, label: 'Radio' },
        { type: 'date', icon: Calendar, label: 'Date' },
        { type: 'button', icon: MousePointerClick, label: 'Submit' }
    ];

    const addElement = (type: string, label: string) => {
        const newElement: FormElement = {
            id: Date.now().toString(),
            type,
            label: label || `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            placeholder: `Enter ${type}`,
            required: false,
            order: formElements.length + 1,
            options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2', 'Option 3'] : undefined
        };
        setFormElements([...formElements, newElement]);
        setSelectedElement(newElement);
    };

    const updateElement = (id: string, updates: Partial<FormElement>) => {
        setFormElements(formElements.map(el => el.id === id ? { ...el, ...updates } : el));
        if (selectedElement?.id === id) {
            setSelectedElement({ ...selectedElement, ...updates } as FormElement);
        }
    };

    const deleteElement = (id: string) => {
        setFormElements(formElements.filter(el => el.id !== id));
        if (selectedElement?.id === id) {
            setSelectedElement(null);
        }
    };

    const duplicateElement = (element: FormElement) => {
        const newElement: FormElement = {
            ...element,
            id: Date.now().toString(),
            order: formElements.length + 1
        };
        setFormElements([...formElements, newElement]);
    };

    const handleDragStart = (e: React.DragEvent, element: FormElement) => {
        setDraggedItem(element);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, targetElement: FormElement) => {
        e.preventDefault();
        if (!draggedItem || draggedItem.id === targetElement.id) return;

        const draggedIndex = formElements.findIndex(el => el.id === draggedItem.id);
        const targetIndex = formElements.findIndex(el => el.id === targetElement.id);

        const newElements = [...formElements];
        newElements.splice(draggedIndex, 1);
        newElements.splice(targetIndex, 0, draggedItem);

        setFormElements(newElements.map((el, idx) => ({ ...el, order: idx + 1 })));
    };

    const renderFormElement = (element: FormElement) => {
        const commonProps = {
            placeholder: element.placeholder,
            className: "w-full"
        };

        switch (element.type) {
            case 'text':
            case 'email':
            case 'number':
                return <Input disabled type={element.type} {...commonProps} />;
            case 'textarea':
                return <Textarea disabled {...commonProps} rows={3} />;
            case 'select':
                return (
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={element.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {element.options?.map((option, idx) => (
                                <SelectItem key={idx} value={option.toLowerCase().replace(/\s+/g, '-') || `option-${idx}`}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case 'checkbox':
                return (
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id={element.id} className="w-4 h-4" />
                        <label htmlFor={element.id} className="text-sm">{element.label}</label>
                    </div>
                );
            case 'radio':
                return (
                    <div className="space-y-2">
                        {element.options?.map((option, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                                <input type="radio" name={element.id} id={`${element.id}-${idx}`} className="w-4 h-4" />
                                <label htmlFor={`${element.id}-${idx}`} className="text-sm">{option}</label>
                            </div>
                        ))}
                    </div>
                );
            case 'date':
                return <Input disabled type="date" {...commonProps} />;
            case 'button':
                return <Button className="w-full">Submit</Button>;
            default:
                return <Input disabled {...commonProps} />;
        }
    };

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Left Sidebar - Components */}
            <div className="w-80 bg-card border-r border-border overflow-y-auto">
                <div className="p-4 border-b border-border">
                    <h2 className="text-lg font-semibold">Components</h2>
                </div>

                <div className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                        {componentTypes.map(({ type, icon: Icon, label }) => (
                            <button
                                key={`${type}-${label}`}
                                onClick={() => addElement(type, label)}
                                className="flex flex-col items-center justify-center gap-2 p-4 bg-background hover:bg-accent hover:text-accent-foreground rounded-lg border-2 border-dashed border-border hover:border-primary transition-all text-center group"
                            >
                                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="text-xs font-medium">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Center - Form Canvas */}
            <div className="flex-1 p-6 overflow-y-auto bg-muted/30">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-2 mb-6">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Trash2 className="w-5 h-5" />
                        </Button>

                        <Button onClick={() => saveForm("SAVE_DRAFT")} variant="outline" >
                            {saving && <Spinner />} Save as draft
                        </Button>

                    </div>

                    <Card className="shadow-lg">
                        <CardContent className="p-8">
                            <div className="mb-8">
                                {isEditingTitle ? (
                                    <Input
                                        value={title}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        onBlur={() => setIsEditingTitle(false)}
                                        className="text-2xl font-semibold mb-2 border-none shadow-none focus-visible:ring-0 px-0"
                                        autoFocus
                                    />
                                ) : (
                                    <h1
                                        className="text-2xl font-semibold mb-2 cursor-pointer hover:bg-accent/50 px-2 py-1 rounded -mx-2"
                                        onClick={() => setIsEditingTitle(true)}
                                    >
                                        {title}
                                    </h1>
                                )}

                                {isEditingDescription ? (
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setFormDescription(e.target.value)}
                                        onBlur={() => setIsEditingDescription(false)}
                                        className="text-sm text-muted-foreground border-none shadow-none focus-visible:ring-0 px-0 resize-none"
                                        autoFocus
                                        rows={2}
                                    />
                                ) : (
                                    <p
                                        className="text-sm text-muted-foreground cursor-pointer hover:bg-accent/50 px-2 py-1 rounded -mx-2"
                                        onClick={() => setIsEditingDescription(true)}
                                    >
                                        {description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-6 border-2 border-dashed border-primary/30 rounded-lg p-6 min-h-[400px]">
                                {formElements.map((element) => (
                                    <div
                                        key={element.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, element)}
                                        onDragOver={(e) => handleDragOver(e, element)}
                                        onClick={() => setSelectedElement(element)}
                                        className={`relative group p-4 rounded-lg border-2 transition-all cursor-move ${selectedElement?.id === element.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-transparent hover:border-border hover:bg-accent/50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <GripVertical className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0 cursor-grab active:cursor-grabbing" />
                                            <div className="flex-1 space-y-2">
                                                {element.type !== 'checkbox' && (
                                                    <div className='flex gap-1'>
                                                        <Label className="font-medium block">
                                                            {element.label}
                                                        </Label>
                                                        {element.required && <Label className="text-destructive font-medium block">
                                                            *
                                                        </Label>}
                                                    </div>
                                                )}
                                                {renderFormElement(element)}
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        duplicateElement(element);
                                                    }}
                                                    title="Duplicate"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteElement(element.id);
                                                    }}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {formElements.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <p>Click components from the left to build your form</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Right Sidebar - Properties */}
            <div className="w-80 bg-card border-l border-border overflow-y-auto">
                <div className="p-4 border-b border-border">
                    <h2 className="text-lg font-semibold">Properties</h2>
                </div>

                <div className="p-4">
                    {selectedElement ? (
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm mb-2 block">Label</Label>
                                <Input
                                    value={selectedElement.label}
                                    onChange={(e) => updateElement(selectedElement.id, { label: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label className="text-sm mb-2 block">Type</Label>
                                <Select
                                    value={selectedElement.type}
                                    onValueChange={(value) => updateElement(selectedElement.id, { type: value })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="text">Text</SelectItem>
                                        <SelectItem value="email">Email</SelectItem>
                                        <SelectItem value="number">Number</SelectItem>
                                        <SelectItem value="textarea">Textarea</SelectItem>
                                        <SelectItem value="select">Select</SelectItem>
                                        <SelectItem value="checkbox">Checkbox</SelectItem>
                                        <SelectItem value="radio">Radio</SelectItem>
                                        <SelectItem value="date">Date</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-sm mb-2 block">Placeholder</Label>
                                <Input
                                    value={selectedElement.placeholder}
                                    onChange={(e) => updateElement(selectedElement.id, { placeholder: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label className="text-sm mb-2 block">Order</Label>
                                <Input
                                    type="number"
                                    value={selectedElement.order}
                                    onChange={(e) => updateElement(selectedElement.id, { order: parseInt(e.target.value) })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Required</Label>
                                <Switch
                                    checked={selectedElement.required}
                                    onCheckedChange={(checked) => updateElement(selectedElement.id, { required: checked })}
                                />
                            </div>

                            {(selectedElement.type === 'select' || selectedElement.type === 'radio') && (
                                <div>
                                    <Label className="text-sm mb-2 block">Options</Label>
                                    <div className="space-y-2">
                                        {selectedElement.options?.map((option, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input
                                                    value={option}
                                                    onChange={(e) => {
                                                        const newOptions = [...(selectedElement.options || [])];
                                                        newOptions[idx] = e.target.value;
                                                        updateElement(selectedElement.id, { options: newOptions });
                                                    }}
                                                    className="flex-1"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => {
                                                        const newOptions = (selectedElement.options || []).filter((_, i) => i !== idx);
                                                        updateElement(selectedElement.id, { options: newOptions });
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => {
                                                const newOptions = [...(selectedElement.options || []), `Option ${(selectedElement.options?.length || 0) + 1}`];
                                                updateElement(selectedElement.id, { options: newOptions });
                                            }}
                                        >
                                            + Add Option
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground mt-12">
                            <p>Select an element to edit its properties</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormBuilder;