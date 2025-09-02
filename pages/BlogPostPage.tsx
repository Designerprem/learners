
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS, FACULTY_MEMBERS } from '../constants';

const BlogPostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const post = BLOG_POSTS.find(p => p.id === postId);

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
                </article>
            </div>
        </div>
    );
};

export default BlogPostPage;
