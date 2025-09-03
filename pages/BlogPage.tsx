import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS, FACULTY_MEMBERS } from '../constants';
import type { BlogPost } from '../types';

const BlogPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
    const facultyMap = new Map(FACULTY_MEMBERS.map(f => [f.id, f]));
    
    useEffect(() => {
        try {
            const storedData = localStorage.getItem('siteContent');
            if (storedData) {
                const content = JSON.parse(storedData);
                if (content.blogs) {
                    setPosts(content.blogs);
                }
            }
        } catch (error) {
            console.error("Failed to parse blogs from localStorage", error);
        }
    }, []);

    return (
        <div className="bg-white">
            <div className="bg-brand-dark text-white py-12 md:py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">Learners Academy Blog</h1>
                    <p className="mt-4 text-lg max-w-3xl mx-auto">Insights, tips, and career advice from our ACCA experts.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => {
                        const author = facultyMap.get(post.authorId);
                        return (
                             <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                                <Link to={`/blog/${post.id}`} className="block">
                                    <img src={post.imageUrl.replace('/1200/800', '/800/600')} alt={post.title} className="w-full h-56 object-cover" />
                                </Link>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div>
                                        <p className="text-sm text-brand-red font-semibold">{post.tags.join(' / ')}</p>
                                        <h2 className="text-xl font-bold mt-2 mb-3 group-hover:text-brand-red transition-colors min-h-[3.5rem] line-clamp-2">
                                            <Link to={`/blog/${post.id}`}>{post.title}</Link>
                                        </h2>
                                        <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                                    </div>
                                    <div className="mt-auto pt-6">
                                        <div className="border-t pt-4 flex items-center">
                                            {author && <img src={author.imageUrl.replace('/400/400', '/100/100')} alt={author.name} className="w-10 h-10 rounded-full mr-3" />}
                                            <div>
                                                <p className="font-semibold text-sm">{author ? author.name : 'Learners Academy'}</p>
                                                <p className="text-xs text-gray-500">{new Date(post.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <Link to={`/blog/${post.id}`} className="mt-4 font-semibold text-brand-red self-start block">Read More &rarr;</Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;