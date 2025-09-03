
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS, FACULTY_MEMBERS } from '../constants';
import type { BlogPost, Comment } from '../types';

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


const BlogPostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<BlogPost | undefined>(undefined);

    useEffect(() => {
        let allPosts = BLOG_POSTS;
        try {
            const storedData = localStorage.getItem('siteContent');
            if (storedData) {
                const content = JSON.parse(storedData);
                if (content.blogs) {
                    allPosts = content.blogs;
                }
            }
        } catch (error) {
            console.error("Failed to parse blogs from localStorage", error);
        }
        setPost(allPosts.find(p => p.id === postId));
    }, [postId]);


    if (!post) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <h1 className="text-3xl font-bold">Post Not Found</h1>
                <p className="mt-4">The blog post you are looking for does not exist.</p>
                <Link to="/blog" className="mt-6 inline-block bg-brand-red text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700">
                    &larr; Back to Blog
                </Link>
            </div>
        );
    }

    const author = FACULTY_MEMBERS.find(f => f.id === post.authorId);

    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-12 md:py-20">
                <article className="max-w-4xl mx-auto">
                    <header className="mb-8">
                         <Link to="/blog" className="text-brand-red font-semibold hover:underline mb-4 inline-block">&larr; Back to All Posts</Link>
                        <h1 className="text-3xl md:text-5xl font-black text-brand-dark leading-tight mb-4">{post.title}</h1>
                        <div className="flex items-center text-gray-500">
                            {author && (
                                <div className="flex items-center mr-6">
                                    <img src={author.imageUrl.replace('/400/400', '/100/100')} alt={author.name} className="w-12 h-12 rounded-full mr-3" />
                                    <div>
                                        <p className="font-semibold text-gray-800">{author.name}</p>
                                        <p className="text-sm">{author.qualification}</p>
                                    </div>
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-gray-800">Published on</p>
                                <p className="text-sm">{new Date(post.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                    </header>
                    
                    <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-8" />
                    
                    <div 
                        className="prose lg:prose-xl max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                     <style>{`
                        .prose h3 {
                            color: #B22222;
                        }
                    `}</style>
                    
                    <CommentSection initialComments={post.comments || []} />
                </article>
            </div>
        </div>
    );
};

export default BlogPostPage;