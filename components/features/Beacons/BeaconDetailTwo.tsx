import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from 'lucide-react';
import { GraduationCap } from 'lucide-react';
import { Clock } from 'lucide-react';
import { Globe } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import { Github } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApplicationInput } from '@/lib/validations/application';

const BeaconDetailTwo = ({
    formData,
    updateField,
    handleSubmit,
    error,
}: {
    formData: Partial<ApplicationInput>;
    updateField: (field: keyof ApplicationInput, value: string | number) => void;
    handleSubmit: (e: React.FormEvent) => void;
    error: string | null;
}) => {
    return (
        <div className="flex flex-col flex-1 transition-opacity duration-300 ease-in-out opacity-100 bg-background">
            <div className="flex-1 px-4 overflow-y-auto max-h-[calc(90vh-200px)]">
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Motivation Message */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <MessageCircle className="w-4 h-4 text-muted-foreground/60" />
                            <Label className="text-sm font-medium text-foreground">
                                Why do you want to join this project? *
                            </Label>
                        </div>
                        <Textarea
                            placeholder="Explain your motivation and how you can contribute..."
                            value={formData.motivation_message || ''}
                            onChange={(e) => updateField('motivation_message', e.target.value)}
                            className="min-h-[80px] resize-none bg-card text-foreground border-border"
                            required
                        />
                        <p className="text-xs text-muted-foreground/70">
                            {formData.motivation_message?.length || 0}/50 characters minimum
                        </p>
                    </div>

                    {/* What They Bring */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-muted-foreground/60" />
                            <Label className="text-sm font-medium text-foreground">
                                What skills and experience do you bring?
                            </Label>
                        </div>
                        <Textarea
                            placeholder="Describe your relevant skills and background..."
                            value={formData.what_they_bring || ''}
                            onChange={(e) => updateField('what_they_bring', e.target.value)}
                            className="min-h-[60px] resize-none bg-card text-foreground border-border"
                        />
                    </div>

                    {/* What They Want to Learn */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <GraduationCap className="w-4 h-4 text-muted-foreground/60" />
                            <Label className="text-sm font-medium text-foreground">What do you hope to learn?</Label>
                        </div>
                        <Textarea
                            placeholder="What skills or knowledge are you looking to gain..."
                            value={formData.what_they_want_to_learn || ''}
                            onChange={(e) => updateField('what_they_want_to_learn', e.target.value)}
                            className="min-h-[60px] resize-none bg-card text-foreground border-border"
                        />
                    </div>

                    {/* Work Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Hours per Week */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-muted-foreground/60" />
                                <Label className="text-sm font-medium text-foreground">Hours per week</Label>
                            </div>
                            <Select onValueChange={(value) => updateField('hours_per_week', parseInt(value))}>
                                <SelectTrigger className="w-full bg-card text-foreground border-border">
                                    <SelectValue placeholder="Select hours" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    <SelectItem value="5">5 hours</SelectItem>
                                    <SelectItem value="10">10 hours</SelectItem>
                                    <SelectItem value="15">15 hours</SelectItem>
                                    <SelectItem value="20">20 hours</SelectItem>
                                    <SelectItem value="25">25+ hours</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Timezone */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Globe className="w-4 h-4 text-muted-foreground/60" />
                                <Label className="text-sm font-medium text-foreground">Timezone</Label>
                            </div>
                            <Input
                                type="text"
                                placeholder="e.g., UTC+3, EST, PST"
                                value={formData.timezone || ''}
                                onChange={(e) => updateField('timezone', e.target.value)}
                                className="bg-card text-foreground border-border placeholder:text-muted-foreground/50"
                            />
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Portfolio URL */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <ExternalLink className="w-4 h-4 text-muted-foreground/60" />
                                <Label className="text-sm font-medium text-foreground">Portfolio URL</Label>
                            </div>
                            <Input
                                type="url"
                                placeholder="https://your-portfolio.com"
                                value={formData.portfolio_url || ''}
                                onChange={(e) => updateField('portfolio_url', e.target.value)}
                                className="bg-card text-foreground border-border placeholder:text-muted-foreground/50"
                            />
                        </div>

                        {/* GitHub URL */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Github className="w-4 h-4 text-muted-foreground/60" />
                                <Label className="text-sm font-medium text-foreground">GitHub URL</Label>
                            </div>
                            <Input
                                type="url"
                                placeholder="https://github.com/username"
                                value={formData.github_url || ''}
                                onChange={(e) => updateField('github_url', e.target.value)}
                                className="bg-card text-foreground border-border placeholder:text-muted-foreground/50"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-destructive/15 border border-destructive/30 rounded-lg">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default BeaconDetailTwo;
