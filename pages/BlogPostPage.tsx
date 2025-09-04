

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS, FACULTY_MEMBERS, STUDENTS } from '../constants';
import type { BlogPost, Comment, FacultyMember, Student } from '../types';

const CommentSection: React.FC<{ initialComments: Comment[] }> = ({ initialComments }) => {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [authorName, setAuthorName] = useState('');
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!authorName.trim() || !commentText.trim()) return;

        setIsSubmitting(true);
        
        const newComment: Comment = {
            id: Date.now(),
            authorName,
            text: commentText,
            timestamp: new Date().toISOString(),
            authorImageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random&color=fff`,
        };

        // Simulate network delay
        setTimeout(() => {
            setComments(prev => [newComment, ...prev]);
            setAuthorName('');
            setCommentText('');
            setIsSubmitting(false);
        }, 500);
    };

    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="mt-12 border-t pt-8">
            <h3 className="text-2xl font-bold mb-6">{comments.length} Comment{comments.length !== 1 ? 's' : ''}</h3>
            
            <div className="bg-brand-beige p-6 rounded-lg mb-8">
                <h4 className="font-bold text-lg mb-4">Leave a Reply</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">Name</label>
                        <input 
                            type="text" 
                            id="authorName"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white"
                        />
                    </div>
                     <div>
                        <label htmlFor="commentText" className="block text-sm font-medium text-gray-700">Comment</label>
                        <textarea 
                            id="commentText"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            rows={4} 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white"
                        />
                    </div>
                    <div className="text-right">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-brand-red text-white py-2 px-6 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:bg-red-300"
                        >
                            {isSubmitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-6">
                {comments.map(comment => (
                    <div key={comment.id} className="flex items-start gap-4">
                        <img 
                            src={comment.authorImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorName)}&background=random&color=fff`} 
                            alt={comment.authorName} 
                            className="w-12 h-12 rounded-full bg-gray-200" 
                        />
                        <div className="flex-1 bg-gray-50 p-4 rounded-lg border">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-brand-dark">{comment.authorName}</p>
                                <p className="text-xs text-gray-500">{timeSince(comment.timestamp)}</p>
                            </div>
                            <p className="text-gray-700 mt-2">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Sidebar: React.FC<{ post: BlogPost; author: FacultyMember | Student; allPosts: BlogPost[] }> = ({ post, author, allPosts }) => {
    const relatedPosts = allPosts
        .filter(p => p.id !== post.id && p.status === 'Published' && p.tags.some(tag => post.tags.includes(tag)))
        .slice(0, 3);
    
    const authorImageUrl = 'imageUrl' in author ? author.imageUrl : author.avatarUrl;
    const isFaculty = 'qualification' in author;

    return (
        <aside className="space-y-8">
            {/* Author Card */}
            <div className="bg-brand-beige p-6 rounded-lg text-center">
                <img src={authorImageUrl} alt={author.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md" />
                <h3 className="font-bold text-xl text-brand-dark">{author.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                    {isFaculty ? author.qualification : `Student ID: ${author.studentId}`}
                </p>
                <p className="text-sm text-gray-700">
                    {isFaculty ? author.bio : `Enrolled in ${author.currentLevel}`}
                </p>
            </div>
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-bold text-xl text-brand-dark mb-4 border-b pb-2">Related Posts</h3>
                    <div className="space-y-4">
                        {relatedPosts.map(p => (
                            <Link key={p.id} to={`/blog/${p.id}`} className="flex items-center gap-4 group">
                                <img src={p.imageUrl} alt={p.title} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-sm leading-tight group-hover:text-brand-red transition-colors">{p.title}</h4>
                                     <p className="text-xs text-gray-500 mt-1">{new Date(p.publicationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
};


const BlogPostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [allPosts, setAllPosts] = useState<BlogPost[]>(BLOG_POSTS);

    useEffect(() => {
        let posts = BLOG_POSTS;
        try {
            const storedData = localStorage.getItem('siteContent');
            if (storedData) {
                const content = JSON.parse(storedData);
                if (content.blogs) {
                    posts = content.blogs;
                }
            }
        } catch (error) {
            console.error("Failed to parse blogs from localStorage", error);
        }
        setAllPosts(posts);
    }, [postId]);
    
    const post = useMemo(() => allPosts.find(p => p.id === postId), [allPosts, postId]);

    const author = useMemo(() => {
        if (!post) return null;
        if (post.authorType === 'student') {
            return STUDENTS.find(s => s.id === post.authorId);
        }
        return FACULTY_MEMBERS.find(f => f.id === post.authorId);
    }, [post]);


    if (!post || post.status === 'Draft') {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <h1 className="text-3xl font-bold">Post Not Found</h1>
                <p className="mt-4">The blog post you are looking for does not exist or has not been published.</p>
                <Link to="/blog" className="mt-6 inline-block bg-brand-red text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700">
                    Back to Blog
                </Link>
            </div>
        );
    }

    if (!author) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <h1 className="text-3xl font-bold">Author Not Found</h1>
                <p className="mt-4">The author for this post could not be found.</p>
                <Link to="/blog" className="mt-6 inline-block bg-brand-red text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700">
                    Back to Blog
                </Link>
            </div>
        );
    }
    
    const authorImageUrl = 'imageUrl' in author ? author.imageUrl : author.avatarUrl;

    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-12 md:py-20">
                <div className="grid lg:grid-cols-3 gap-12">
                    <main className="lg:col-span-2">
                        <article>
                            <header className="mb-8">
                                <div className="mb-4">
                                    <Link to="/blog" className="text-brand-red font-semibold hover:underline">&larr; Back to Blog</Link>
                                </div>
                                <p className="text-sm text-brand-red font-semibold">{post.tags.join(' / ')}</p>
                                <h1 className="text-4xl md:text-5xl font-black text-brand-dark mt-2 mb-4">{post.title}</h1>
                                <div className="flex items-center text-sm text-gray-500">
                                    <img src={authorImageUrl.replace('/400/400', '/100/100')} alt={author.name} className="w-10 h-10 rounded-full mr-3" />
                                    <span>By <span className="font-semibold">{author.name}</span> on {new Date(post.publicationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    <span className="mx-2">·</span>
                                    <span>{post.timeToRead} min read</span>
                                </div>
                            </header>
                            <img src={post.imageUrl} alt={post.title} className="w-full rounded-lg shadow-lg mb-8" />
                            <div className="prose lg:prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
                        </article>
                        <CommentSection initialComments={post.comments || []} />
                    </main>
                    <Sidebar post={post} author={author} allPosts={allPosts} />
                </div>
            </div>
        </div>
    );
};

export default BlogPostPage;