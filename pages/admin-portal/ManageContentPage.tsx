import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HERO_SLIDES, GALLERY_IMAGES, VLOGS, BLOG_POSTS, NEWS_TICKER_MESSAGES, FACULTY_MEMBERS, POPUP_NOTIFICATION, STUDENTS, TESTIMONIALS } from '../../constants';
import type { HeroSlide, GalleryImage, Vlog, BlogPost, PopupNotification, Testimonial, Student, FacultyMember } from '../../types';
import { compressImage } from '../../services/imageCompressionService';

type Tab = 'Banners' | 'Gallery' | 'Vlogs' | 'Blogs' | 'News Ticker' | 'Popup' | 'Testimonials';

// Helper to create a unique ID for new items
const generateId = () => Date.now();
const generateSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const calculateTimeToRead = (htmlContent: string): number => {
    if (!htmlContent) return 0;
    const text = htmlContent.replace(/<[^>]*>?/gm, ''); // Strip HTML tags
    const words = text.split(/\s+/).filter(Boolean); // Split by whitespace and remove empty strings
    return Math.ceil(words.length / 200); // Average reading speed is 200 WPM
};

// ==========================================================
// File to Base64 Converter (for non-image files like videos)
// ==========================================================
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

// ==========================================================
// Reusable Modal Component
// ==========================================================
const Modal: React.FC<{ children: React.ReactNode, title: string, onClose: () => void }> = ({ children, title, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div ref={modalRef} className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-brand-dark">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl" aria-label="Close modal">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

// ==========================================================
// Banners Components
// ==========================================================
const BannerForm = ({ banner, onSave, onCancel }: { banner: HeroSlide | null, onSave: (data: Omit<HeroSlide, 'id'>, imageFile: File | null) => void, onCancel: () => void }) => {
    const [formState, setFormState] = useState(banner || { url: '', alt: '', title: { main: '', highlighted: '' }, subtitle: '', buttons: [] });
    const [imageFile, setImageFile] = useState<File | null>(null);

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formState, imageFile); }} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
                <input type="hidden" value={formState.url} />
                <div>
                    <label className="block text-sm font-medium">Main Title</label>
                    <input value={formState.title.main} onChange={e => setFormState({...formState, title: {...formState.title, main: e.target.value}})} className="mt-1 block w-full p-2 border rounded-md bg-white" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Highlighted Title</label>
                    <input value={formState.title.highlighted} onChange={e => setFormState({...formState, title: {...formState.title, highlighted: e.target.value}})} className="mt-1 block w-full p-2 border rounded-md bg-white" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Subtitle</label>
                    <textarea value={formState.subtitle} onChange={e => setFormState({...formState, subtitle: e.target.value})} rows={2} className="mt-1 block w-full p-2 border rounded-md bg-white" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Background Image</label>
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100" />
                </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Save Banner</button>
            </div>
        </form>
    );
};

const ManageBanners = ({ banners, onUpdate }: { banners: HeroSlide[], onUpdate: (data: HeroSlide[]) => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<HeroSlide | null>(null);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleDragSort = () => {
        const bannersCopy = [...banners];
        const draggedItemContent = bannersCopy.splice(dragItem.current!, 1)[0];
        bannersCopy.splice(dragOverItem.current!, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        onUpdate(bannersCopy);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            onUpdate(banners.filter(item => item.id !== id));
        }
    };
    
    const handleAddNew = () => {
        setEditingBanner(null);
        setIsModalOpen(true);
    };

    const handleEdit = (banner: HeroSlide) => {
        setEditingBanner(banner);
        setIsModalOpen(true);
    };

    const handleSave = async (formData: Omit<HeroSlide, 'id'>, imageFile: File | null) => {
        let imageUrl = formData.url;
        if (imageFile) {
            imageUrl = await compressImage(imageFile, { maxWidth: 1920, maxHeight: 1080, quality: 0.8 });
        }
        const finalData = { ...formData, url: imageUrl };

        if (editingBanner) {
            onUpdate(banners.map(b => b.id === editingBanner.id ? { ...editingBanner, ...finalData } : b));
        } else {
            onUpdate([...banners, { ...finalData, id: generateId() }]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="text-right">
                <button onClick={handleAddNew} className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Add New Banner</button>
            </div>
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    draggable
                    onDragStart={() => dragItem.current = index}
                    onDragEnter={() => dragOverItem.current = index}
                    onDragEnd={handleDragSort}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex items-center gap-4 border p-2 rounded-lg cursor-grab active:cursor-grabbing bg-white"
                >
                    <img src={banner.url} alt={banner.alt} className="w-24 h-16 object-cover rounded" />
                    <div className="flex-grow">
                        <p className="font-bold">{banner.title.main} <span className="text-brand-red">{banner.title.highlighted}</span></p>
                    </div>
                    <div className="text-sm space-x-2">
                        <button onClick={() => handleEdit(banner)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(banner.id)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                </div>
            ))}
            {isModalOpen && (
                <Modal title={editingBanner ? 'Edit Banner' : 'Add New Banner'} onClose={() => setIsModalOpen(false)}>
                    <BannerForm banner={editingBanner} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
};

// ==========================================================
// Gallery Components
// ==========================================================
const GalleryForm = ({ item, onSave, onCancel }: { item: GalleryImage | null, onSave: (data: Omit<GalleryImage, 'id'>, imageFiles: File[]) => void, onCancel: () => void }) => {
    const [formState, setFormState] = useState<Omit<GalleryImage, 'id'>>(() => {
        if (item) {
            const { id, ...rest } = item;
            return rest;
        }
        return { type: 'image', src: '', alt: '', category: 'Campus' };
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formState, imageFiles); }} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Type</label>
                        <select value={formState.type} onChange={e => setFormState({...formState, type: e.target.value as 'image' | 'video'})} className="mt-1 block w-full p-2 border rounded-md bg-white">
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium">Category</label>
                        <select value={formState.category} onChange={e => setFormState({...formState, category: e.target.value as GalleryImage['category']})} className="mt-1 block w-full p-2 border rounded-md bg-white">
                            <option>Campus</option>
                            <option>Events</option>
                            <option>Classrooms</option>
                            <option>Students</option>
                        </select>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium">Alt Text / Title</label>
                    <input value={formState.alt} onChange={e => setFormState({...formState, alt: e.target.value})} disabled={imageFiles.length > 1} className="mt-1 block w-full p-2 border rounded-md bg-white disabled:bg-gray-100" required />
                    {imageFiles.length > 1 && <p className="text-xs text-gray-500 mt-1">Alt text will be generated from filenames.</p>}
                </div>

                {formState.type === 'video' && (
                    <div className="p-4 border rounded-md bg-gray-50 space-y-4">
                         <p className="text-sm text-gray-600">Only YouTube embed URLs are supported for gallery videos to ensure optimal performance and avoid storage issues.</p>
                         <div>
                            <label className="block text-sm font-medium">YouTube Embed URL</label>
                            <input value={formState.videoUrl || ''} onChange={e => setFormState({...formState, videoUrl: e.target.value, localVideoSrc: undefined })} className="mt-1 block w-full p-2 border rounded-md bg-white" placeholder="https://www.youtube.com/embed/..." required={!item?.videoUrl} />
                        </div>
                    </div>
                )}
                
                {formState.type === 'image' ? (
                     <div>
                        <label className="block text-sm font-medium">Image File(s)</label>
                        <input type="file" multiple={!item} accept="image/*" onChange={e => setImageFiles(e.target.files ? Array.from(e.target.files) : [])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100" required={!item} />
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium">Thumbnail Image</label>
                        <input type="file" accept="image/*" onChange={e => setImageFiles(e.target.files ? Array.from(e.target.files) : [])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100" required={!item || !item.src} />
                        {item?.src && imageFiles.length === 0 && <img src={item.src} alt="current thumbnail" className="w-20 h-20 object-cover mt-2 rounded-md" />}
                    </div>
                )}
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Save Item</button>
            </div>
        </form>
    );
};

const ManageGallery = ({ gallery, onUpdate }: { gallery: GalleryImage[], onUpdate: (data: GalleryImage[]) => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryImage | null>(null);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleDragSort = () => {
        const galleryCopy = [...gallery];
        const draggedItemContent = galleryCopy.splice(dragItem.current!, 1)[0];
        galleryCopy.splice(dragOverItem.current!, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        onUpdate(galleryCopy);
    };


    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this gallery item?')) {
            onUpdate(gallery.filter(item => item.id !== id));
        }
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: GalleryImage) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSave = async (formData: Omit<GalleryImage, 'id'>, imageFiles: File[]) => {
        if (editingItem) {
            // Logic to edit a single item
            let newSrc = formData.src;
            if (imageFiles[0]) {
                newSrc = await compressImage(imageFiles[0], { maxWidth: 800, maxHeight: 600, quality: 0.8 });
            }
            const updatedItemData = { ...formData, src: newSrc, localVideoSrc: undefined };
            onUpdate(gallery.map(g => g.id === editingItem.id ? { ...updatedItemData, id: editingItem.id } : g));
        } else {
            // Logic to add new items
            if (formData.type === 'image' && imageFiles.length > 0) {
                const newItems: GalleryImage[] = await Promise.all(
                    imageFiles.map(async file => {
                        const src = await compressImage(file, { maxWidth: 800, maxHeight: 600, quality: 0.8 });
                        const alt = imageFiles.length > 1 ? file.name.replace(/\.[^/.]+$/, "") : formData.alt;
                        return {
                            id: generateId(),
                            type: 'image' as 'image',
                            src,
                            alt,
                            category: formData.category,
                        };
                    })
                );
                onUpdate([...gallery, ...newItems]);
            } else if (formData.type === 'video' && imageFiles[0]) {
                const thumbnailSrc = await compressImage(imageFiles[0], { maxWidth: 600, maxHeight: 400, quality: 0.7 });
                const newItem: GalleryImage = {
                    ...formData,
                    id: generateId(),
                    src: thumbnailSrc,
                    localVideoSrc: undefined,
                };
                onUpdate([...gallery, newItem]);
            }
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="text-right">
                <button onClick={handleAddNew} className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Add New Item</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {gallery.map((item, index) => (
                    <div
                        key={item.id}
                        draggable
                        onDragStart={() => dragItem.current = index}
                        onDragEnter={() => dragOverItem.current = index}
                        onDragEnd={handleDragSort}
                        onDragOver={(e) => e.preventDefault()}
                        className="relative group border rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
                    >
                        <img src={item.src} alt={item.alt} className="w-full h-32 object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2">
                             <button onClick={() => handleEdit(item)} className="text-white opacity-0 group-hover:opacity-100 px-2 py-1 bg-blue-600 rounded text-xs">Edit</button>
                             <button onClick={() => handleDelete(item.id)} className="text-white opacity-0 group-hover:opacity-100 px-2 py-1 bg-brand-red rounded text-xs">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
             {isModalOpen && (
                <Modal title={editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'} onClose={() => setIsModalOpen(false)}>
                    <GalleryForm item={editingItem} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
};

// ==========================================================
// Vlogs Components
// ==========================================================
const VlogForm = ({ vlog, onSave, onCancel }: { vlog: Vlog | null, onSave: (data: Omit<Vlog, 'id' | 'publicationDate'>, thumbnailFile: File | null) => void, onCancel: () => void }) => {
    const [formState, setFormState] = useState(vlog || { title: '', description: '', sourceType: 'url' as const, videoUrl: '', thumbnailUrl: '' });
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    
    useEffect(() => {
        if (formState.sourceType !== 'url') {
            setFormState(prev => ({ ...prev, sourceType: 'url', localVideoSrc: undefined }));
        }
    }, [formState.sourceType]);

    return (
         <form onSubmit={(e) => { e.preventDefault(); onSave(formState, thumbnailFile); }} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
                <input type="hidden" value={formState.sourceType}/>
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} className="mt-1 block w-full p-2 border rounded-md bg-white" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} rows={3} className="mt-1 block w-full p-2 border rounded-md bg-white" required />
                </div>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">Note: For stability and performance, all vlogs must be hosted on a service like YouTube. Please provide the embed URL below.</p>
                <div>
                    <label className="block text-sm font-medium">YouTube Embed URL</label>
                    <input value={formState.videoUrl} onChange={e => setFormState({...formState, videoUrl: e.target.value, localVideoSrc: undefined, sourceType: 'url'})} className="mt-1 block w-full p-2 border rounded-md bg-white" placeholder="https://www.youtube.com/embed/..." required />
                </div>
                 
                <div>
                    <label className="block text-sm font-medium">Thumbnail Image</label>
                    <input type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100" required={!vlog || !vlog.thumbnailUrl} />
                     {vlog?.thumbnailUrl && !thumbnailFile && <img src={vlog.thumbnailUrl} alt="current thumbnail" className="w-20 h-20 object-cover mt-2 rounded-md" />}
                </div>
            </div>
             <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Save Vlog</button>
            </div>
        </form>
    );
 };

const ManageVlogs = ({ vlogs, onUpdate }: { vlogs: Vlog[], onUpdate: (data: Vlog[]) => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVlog, setEditingVlog] = useState<Vlog | null>(null);

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this vlog?')) {
            onUpdate(vlogs.filter(item => item.id !== id));
        }
    };
    
     const handleAddNew = () => {
        setEditingVlog(null);
        setIsModalOpen(true);
    };

    const handleEdit = (vlog: Vlog) => {
        setEditingVlog(vlog);
        setIsModalOpen(true);
    };

    const handleSave = async (formData: Omit<Vlog, 'id' | 'publicationDate'>, thumbnailFile: File | null) => {
        let thumbnailUrl = formData.thumbnailUrl;

        if (thumbnailFile) {
            thumbnailUrl = await compressImage(thumbnailFile, { maxWidth: 600, maxHeight: 400, quality: 0.7 });
        }

        const finalData = { ...formData, thumbnailUrl, sourceType: 'url' as const, localVideoSrc: undefined };

        if (editingVlog) {
            onUpdate(vlogs.map(v => v.id === editingVlog.id ? { ...editingVlog, ...finalData } : v));
        } else {
            onUpdate([...vlogs, { ...finalData, id: generateId(), publicationDate: new Date().toISOString().split('T')[0] }]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="text-right">
                <button onClick={handleAddNew} className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Add New Vlog</button>
            </div>
            {vlogs.map(vlog => (
                <div key={vlog.id} className="flex items-center gap-4 border p-2 rounded-lg">
                    <img src={vlog.thumbnailUrl} alt={vlog.title} className="w-24 h-16 object-cover rounded" />
                    <div className="flex-grow">
                        <p className="font-bold">{vlog.title}</p>
                        <p className="text-xs text-gray-500 truncate">{vlog.sourceType === 'url' ? vlog.videoUrl : 'Uploaded Video'}</p>
                    </div>
                    <div className="text-sm space-x-2">
                        <button onClick={() => handleEdit(vlog)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(vlog.id)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                </div>
            ))}
            {isModalOpen && (
                <Modal title={editingVlog ? 'Edit Vlog' : 'Add New Vlog'} onClose={() => setIsModalOpen(false)}>
                    <VlogForm vlog={editingVlog} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
};

// ==========================================================
// Blogs Components
// ==========================================================
const BlogForm = ({ blog, onSave, onCancel }: { blog: BlogPost | null, onSave: (data: Omit<BlogPost, 'id'|'publicationDate'>, imageFile: File | null) => void, onCancel: () => void }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [faculty, setFaculty] = useState<FacultyMember[]>([]);

    useEffect(() => {
        const storedStudents = localStorage.getItem('students');
        setStudents(storedStudents ? JSON.parse(storedStudents) : STUDENTS);

        const storedFaculty = localStorage.getItem('faculty');
        setFaculty(storedFaculty ? JSON.parse(storedFaculty) : FACULTY_MEMBERS);
    }, []);

    const [formState, setFormState] = useState(() => {
        if (blog) {
            const { id, publicationDate, ...editableData } = blog;
            return editableData;
        }

        // Safely determine the initial author
        let initialAuthorId: number = 0;
        let initialAuthorType: 'faculty' | 'student' = 'faculty';

        const facultyFromStorage = localStorage.getItem('faculty');
        const allFaculty = facultyFromStorage ? JSON.parse(facultyFromStorage) : FACULTY_MEMBERS;
        
        const studentsFromStorage = localStorage.getItem('students');
        const allStudents = studentsFromStorage ? JSON.parse(studentsFromStorage) : STUDENTS;


        if (allFaculty.length > 0) {
            initialAuthorId = allFaculty[0].id;
            initialAuthorType = 'faculty';
        } else if (allStudents.length > 0) {
            initialAuthorId = allStudents[0].id;
            initialAuthorType = 'student';
        }
        
        const initialState: Omit<BlogPost, 'id' | 'publicationDate'> = {
            title: '',
            authorId: initialAuthorId,
            authorType: initialAuthorType,
            excerpt: '',
            content: '',
            imageUrl: '',
            tags: [],
            status: 'Published',
            isFeatured: false,
            timeToRead: 0,
        };
        return initialState;
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(blog?.imageUrl || null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setImageFile(file);
        if (file) {
            const base64 = await fileToBase64(file);
            setPreviewUrl(base64);
        } else {
            setPreviewUrl(null);
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formState, imageFile); }} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} className="mt-1 block w-full p-2 border rounded-md bg-white" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Author</label>
                        <select 
                            value={`${formState.authorType}-${formState.authorId}`} 
                            onChange={e => {
                                const [type, id] = e.target.value.split('-');
                                setFormState({
                                    ...formState, 
                                    authorType: type as 'faculty' | 'student',
                                    authorId: Number(id)
                                });
                            }} 
                            className="mt-1 block w-full p-2 border rounded-md bg-white">
                            <optgroup label="Faculty">
                                {faculty.map(f => <option key={`faculty-${f.id}`} value={`faculty-${f.id}`}>{f.name}</option>)}
                            </optgroup>
                            <optgroup label="Students">
                                {students.map(s => <option key={`student-${s.id}`} value={`student-${s.id}`}>{s.name} ({s.studentId})</option>)}
                            </optgroup>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Excerpt</label>
                    <textarea value={formState.excerpt} onChange={e => setFormState({...formState, excerpt: e.target.value})} rows={3} className="mt-1 block w-full p-2 border rounded-md bg-white" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Content</label>
                    <textarea value={formState.content} onChange={e => setFormState({...formState, content: e.target.value})} rows={8} className="mt-1 block w-full p-2 border rounded-md bg-white font-mono text-sm" required />
                     <p className="text-xs text-gray-500 mt-1">HTML is allowed. You can paste formatted content from editors like MS Word or Google Docs.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Tags (comma-separated)</label>
                        <input value={Array.isArray(formState.tags) ? formState.tags.join(', ') : ''} onChange={e => setFormState({...formState, tags: e.target.value.split(',').map(t => t.trim())})} className="mt-1 block w-full p-2 border rounded-md bg-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Status</label>
                        <select value={formState.status} onChange={e => setFormState({...formState, status: e.target.value as 'Published' | 'Draft'})} className="mt-1 block w-full p-2 border rounded-md bg-white">
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" id="isFeatured" checked={formState.isFeatured} onChange={e => setFormState({...formState, isFeatured: e.target.checked})} className="h-4 w-4 text-brand-red border-gray-300 rounded focus:ring-brand-red" />
                    <label htmlFor="isFeatured" className="ml-2 block text-sm font-medium">Mark as Featured Post</label>
                </div>
                 <div>
                    <label className="block text-sm font-medium">Featured Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100" />
                    {previewUrl && <img src={previewUrl} alt="Preview" className="mt-4 w-48 h-auto rounded-md shadow-sm" />}
                </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Save Post</button>
            </div>
        </form>
    );
};

const ManageBlogs = ({ blogs, onUpdate }: { blogs: BlogPost[], onUpdate: (data: BlogPost[]) => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            onUpdate(blogs.filter(item => item.id !== id));
        }
    };
    
    const handleAddNew = () => {
        setEditingBlog(null);
        setIsModalOpen(true);
    };

    const handleEdit = (blog: BlogPost) => {
        setEditingBlog(blog);
        setIsModalOpen(true);
    };
    
    const handleSave = async (formData: Omit<BlogPost, 'id' | 'publicationDate'>, imageFile: File | null) => {
        let imageUrl = formData.imageUrl;
        if (imageFile) {
            imageUrl = await compressImage(imageFile, { maxWidth: 1200, maxHeight: 800, quality: 0.8 });
        }

        const timeToRead = calculateTimeToRead(formData.content);
        const finalData = { ...formData, imageUrl, timeToRead };
        
        if (editingBlog) {
            onUpdate(blogs.map(b => b.id === editingBlog.id ? { ...editingBlog, ...finalData } : b));
        } else {
            onUpdate([{ 
                ...finalData, 
                id: generateSlug(finalData.title), 
                publicationDate: new Date().toISOString().split('T')[0] 
            }, ...blogs]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="text-right">
                <button onClick={handleAddNew} className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Create New Post</button>
            </div>
            {blogs.map(blog => (
                <div key={blog.id} className="flex items-center gap-4 border p-2 rounded-lg bg-white">
                    <img src={blog.imageUrl} alt={blog.title} className="w-24 h-16 object-cover rounded" />
                    <div className="flex-grow">
                        <p className="font-bold">{blog.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                             <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${blog.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                                {blog.status}
                            </span>
                            {blog.isFeatured && (
                                <span className="flex items-center gap-1 text-yellow-600 font-bold">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    Featured
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-sm space-x-2">
                        <button onClick={() => handleEdit(blog)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                </div>
            ))}
            {isModalOpen && (
                <Modal title={editingBlog ? 'Edit Blog Post' : 'Create New Post'} onClose={() => setIsModalOpen(false)}>
                    <BlogForm blog={editingBlog} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
};

// ==========================================================
// News Ticker Component
// ==========================================================
const ManageNewsTicker = ({ messages, onUpdate }: { messages: string[], onUpdate: (data: string[]) => void }) => {
    const [newMessage, setNewMessage] = useState('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingText, setEditingText] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onUpdate([...messages, newMessage.trim()]);
            setNewMessage('');
        }
    };

    const handleDelete = (index: number) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            onUpdate(messages.filter((_, i) => i !== index));
        }
    };
    
    const handleEdit = (index: number, text: string) => {
        setEditingIndex(index);
        setEditingText(text);
    };

    const handleSaveEdit = (index: number) => {
        const updatedMessages = [...messages];
        updatedMessages[index] = editingText;
        onUpdate(updatedMessages);
        setEditingIndex(null);
        setEditingText('');
    };

    return (
        <div className="space-y-4">
             <form onSubmit={handleAdd} className="flex gap-2">
                <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Add new message..." className="flex-grow p-2 border rounded-md bg-white"/>
                <button type="submit" className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Add</button>
            </form>
            <div className="space-y-2">
            {messages.map((msg, index) => (
                <div key={index} className="flex items-center gap-2 border p-2 rounded-lg">
                    {editingIndex === index ? (
                        <input value={editingText} onChange={e => setEditingText(e.target.value)} className="flex-grow p-1 border rounded bg-white" />
                    ) : (
                        <p className="flex-grow">{msg}</p>
                    )}
                    <div className="text-sm space-x-2 flex-shrink-0">
                         {editingIndex === index ? (
                            <button onClick={() => handleSaveEdit(index)} className="text-green-600 hover:underline">Save</button>
                        ) : (
                            <button onClick={() => handleEdit(index, msg)} className="text-blue-600 hover:underline">Edit</button>
                        )}
                        <button onClick={() => handleDelete(index)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
};

// ==========================================================
// Popup Components
// ==========================================================
const PopupForm = ({ popup, onSave, onCancel }: { popup: PopupNotification | null, onSave: (data: Omit<PopupNotification, 'id'>, imageFile: File | null) => void, onCancel: () => void }) => {
    const [formState, setFormState] = useState(popup || { title: '', content: '', imageUrl: '', isActive: true, link: '', linkText: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formState, imageFile); }} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
                <input type="hidden" value={String(formState.isActive)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input type="text" value={formState.title} onChange={e => setFormState({ ...formState, title: e.target.value })} className="mt-1 block w-full p-2 border rounded-md bg-white" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Link Text</label>
                        <input type="text" value={formState.linkText} onChange={e => setFormState({ ...formState, linkText: e.target.value })} className="mt-1 block w-full p-2 border rounded-md bg-white" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Content</label>
                    <textarea value={formState.content} onChange={e => setFormState({ ...formState, content: e.target.value })} rows={3} className="mt-1 block w-full p-2 border rounded-md bg-white" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Link URL (e.g., /admissions)</label>
                    <input type="text" value={formState.link} onChange={e => setFormState({ ...formState, link: e.target.value })} className="mt-1 block w-full p-2 border rounded-md bg-white" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Image</label>
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100" />
                </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Save Popup</button>
            </div>
        </form>
    );
};

const ManagePopup = ({ popups, onUpdate }: { popups: PopupNotification[], onUpdate: (data: PopupNotification[]) => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPopup, setEditingPopup] = useState<PopupNotification | null>(null);

    const handleToggleActive = (id: number) => {
        onUpdate(popups.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this popup?')) {
            onUpdate(popups.filter(p => p.id !== id));
        }
    };

    const handleEdit = (popup: PopupNotification) => {
        setEditingPopup(popup);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingPopup(null);
        setIsModalOpen(true);
    };

    const handleSave = async (formData: Omit<PopupNotification, 'id'>, imageFile: File | null) => {
        let imageUrl = formData.imageUrl;
        if (imageFile) {
            imageUrl = await compressImage(imageFile, { maxWidth: 600, maxHeight: 400, quality: 0.7 });
        }

        const finalData = { ...formData, imageUrl };

        if (editingPopup) {
            onUpdate(popups.map(p => p.id === editingPopup.id ? { ...editingPopup, ...finalData } : p));
        } else {
            onUpdate([...popups, { ...finalData, id: generateId() }]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="text-right">
                <button onClick={handleAddNew} className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Add New Popup</button>
            </div>
            {popups.map(p => (
                <div key={p.id} className="flex items-center gap-4 border p-2 rounded-lg">
                    <img src={p.imageUrl} alt={p.title} className="w-24 h-16 object-cover rounded" />
                    <div className="flex-grow">
                        <p className="font-bold">{p.title}</p>
                        <p className="text-xs text-gray-500 truncate">{p.content}</p>
                    </div>
                    <div className="flex items-center gap-4">
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={p.isActive} onChange={() => handleToggleActive(p.id)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                        </label>
                        <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline text-sm">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                    </div>
                </div>
            ))}
            {isModalOpen && (
                <Modal title={editingPopup ? 'Edit Popup' : 'Add New Popup'} onClose={() => setIsModalOpen(false)}>
                    <PopupForm popup={editingPopup} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
};

// ==========================================================
// Testimonials Components
// ==========================================================
const TestimonialForm = ({ testimonial, onSave, onCancel }: { testimonial: Testimonial | null, onSave: (data: Omit<Testimonial, 'id'>, imageFile: File | null) => void, onCancel: () => void }) => {
    const [formState, setFormState] = useState(testimonial || { name: '', program: '', quote: '', imageUrl: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formState, imageFile); }} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium">Student Name</label>
                    <input name="name" value={formState.name} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md bg-white" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Program (e.g., ACCA Strategic Professional)</label>
                    <input name="program" value={formState.program} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md bg-white" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Quote</label>
                    <textarea name="quote" value={formState.quote} onChange={handleChange} rows={4} className="mt-1 block w-full p-2 border rounded-md bg-white" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Student Photo</label>
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100" />
                    {formState.imageUrl && !imageFile && <img src={formState.imageUrl} alt="current photo" className="w-20 h-20 object-cover mt-2 rounded-full" />}
                </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Save Testimonial</button>
            </div>
        </form>
    );
};

const ManageTestimonials = ({ testimonials, onUpdate }: { testimonials: Testimonial[], onUpdate: (data: Testimonial[]) => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            onUpdate(testimonials.filter(item => item.id !== id));
        }
    };

    const handleAddNew = () => {
        setEditingTestimonial(null);
        setIsModalOpen(true);
    };

    const handleEdit = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setIsModalOpen(true);
    };

    const handleSave = async (formData: Omit<Testimonial, 'id'>, imageFile: File | null) => {
        let imageUrl = formData.imageUrl;
        if (imageFile) {
            imageUrl = await compressImage(imageFile, { maxWidth: 200, maxHeight: 200, quality: 0.8 });
        } else if (!editingTestimonial) {
            imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff`;
        }

        const finalData = { ...formData, imageUrl };

        if (editingTestimonial) {
            onUpdate(testimonials.map(t => t.id === editingTestimonial.id ? { ...editingTestimonial, ...finalData } : t));
        } else {
            onUpdate([{ ...finalData, id: generateId() }, ...testimonials]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="text-right">
                <button onClick={handleAddNew} className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Add New Testimonial</button>
            </div>
            {testimonials.map(testimonial => (
                <div key={testimonial.id} className="flex items-center gap-4 border p-2 rounded-lg bg-white">
                    <img src={testimonial.imageUrl} alt={testimonial.name} className="w-16 h-16 object-cover rounded-full" />
                    <div className="flex-grow">
                        <p className="font-bold">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.program}</p>
                        <p className="text-xs text-gray-600 italic mt-1 line-clamp-1">"{testimonial.quote}"</p>
                    </div>
                    <div className="text-sm space-x-2">
                        <button onClick={() => handleEdit(testimonial)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(testimonial.id)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                </div>
            ))}
            {isModalOpen && (
                <Modal title={editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'} onClose={() => setIsModalOpen(false)}>
                    <TestimonialForm testimonial={editingTestimonial} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
};


// ==========================================================
// Main Component
// ==========================================================
const ManageContentPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('Banners');

    const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
        try {
            const storedData = localStorage.getItem(key);
            if (storedData) {
                return JSON.parse(storedData);
            }
        } catch (e) {
            console.error(`Failed to load ${key} from localStorage`, e);
        }
        return defaultValue;
    };

    const [banners, setBanners] = useState<HeroSlide[]>(() => loadFromLocalStorage('banners', HERO_SLIDES));
    const [gallery, setGallery] = useState<GalleryImage[]>(() => loadFromLocalStorage('gallery', GALLERY_IMAGES));
    const [vlogs, setVlogs] = useState<Vlog[]>(() => loadFromLocalStorage('vlogs', VLOGS));
    const [blogs, setBlogs] = useState<BlogPost[]>(() => loadFromLocalStorage('blogs', BLOG_POSTS));
    const [newsTicker, setNewsTicker] = useState<string[]>(() => loadFromLocalStorage('newsTicker', NEWS_TICKER_MESSAGES));
    const [popups, setPopups] = useState<PopupNotification[]>(() => loadFromLocalStorage('popups', POPUP_NOTIFICATION));
    const [testimonials, setTestimonials] = useState<Testimonial[]>(() => loadFromLocalStorage('testimonials', TESTIMONIALS));

    useEffect(() => {
        try { localStorage.setItem('banners', JSON.stringify(banners)); } 
        catch (e) { console.error("Failed to save banners to localStorage", e); }
    }, [banners]);
    
    useEffect(() => {
        try { localStorage.setItem('gallery', JSON.stringify(gallery)); }
        catch (e) { console.error("Failed to save gallery to localStorage", e); }
    }, [gallery]);

    useEffect(() => {
        try { localStorage.setItem('vlogs', JSON.stringify(vlogs)); }
        catch (e) { console.error("Failed to save vlogs to localStorage", e); }
    }, [vlogs]);

    useEffect(() => {
        try { localStorage.setItem('blogs', JSON.stringify(blogs)); }
        catch (e) { console.error("Failed to save blogs to localStorage", e); }
    }, [blogs]);

    useEffect(() => {
        try { localStorage.setItem('newsTicker', JSON.stringify(newsTicker)); }
        catch (e) { console.error("Failed to save news ticker to localStorage", e); }
    }, [newsTicker]);

    useEffect(() => {
        try { localStorage.setItem('popups', JSON.stringify(popups)); }
        catch (e) { console.error("Failed to save popups to localStorage", e); }
    }, [popups]);
    
    useEffect(() => {
        try { localStorage.setItem('testimonials', JSON.stringify(testimonials)); }
        catch (e) { console.error("Failed to save testimonials to localStorage", e); }
    }, [testimonials]);
    
    useEffect(() => {
        localStorage.removeItem('siteContent');
    }, []);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Banners': return <ManageBanners banners={banners} onUpdate={setBanners} />;
            case 'Gallery': return <ManageGallery gallery={gallery} onUpdate={setGallery} />;
            case 'Vlogs': return <ManageVlogs vlogs={vlogs} onUpdate={setVlogs} />;
            case 'Blogs': return <ManageBlogs blogs={blogs} onUpdate={setBlogs} />;
            case 'News Ticker': return <ManageNewsTicker messages={newsTicker} onUpdate={setNewsTicker} />;
            case 'Popup': return <ManagePopup popups={popups} onUpdate={setPopups} />;
            case 'Testimonials': return <ManageTestimonials testimonials={testimonials} onUpdate={setTestimonials} />;
            default: return null;
        }
    };

    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">Manage Site Content</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="border-b border-gray-200 mb-6 overflow-x-auto">
                    <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
                        {(['Banners', 'Gallery', 'Vlogs', 'Blogs', 'News Ticker', 'Popup', 'Testimonials'] as Tab[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${
                                    activeTab === tab
                                        ? 'border-brand-red text-brand-red'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div>
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default ManageContentPage;
