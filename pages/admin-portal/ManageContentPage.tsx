import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HERO_SLIDES, GALLERY_IMAGES, VLOGS, BLOG_POSTS, NEWS_TICKER_MESSAGES, FACULTY_MEMBERS, POPUP_NOTIFICATION } from '../../constants';
import type { HeroSlide, GalleryImage, Vlog, BlogPost, PopupNotification } from '../../types';

type Tab = 'Banners' | 'Gallery' | 'Vlogs' | 'Blogs' | 'News Ticker' | 'Popup';

// Helper to create a unique ID for new items
const generateId = () => Date.now();
const generateSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

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
// File to Base64 Converter
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
// Banners Component
// ==========================================================
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
            imageUrl = await fileToBase64(imageFile);
        }
        const finalData = { ...formData, url: imageUrl };

        if (editingBanner) {
            onUpdate(banners.map(b => b.id === editingBanner.id ? { ...editingBanner, ...finalData } : b));
        } else {
            onUpdate([...banners, { ...finalData, id: generateId() }]);
        }
        setIsModalOpen(false);
    };

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
// Gallery Component
// ==========================================================
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

    const handleSave = async (formData: Omit<GalleryImage, 'id'>, imageFiles: File[], videoFile: File | null) => {
        if (editingItem) {
            // Logic to edit a single item
            let newSrc = formData.src;
            if (imageFiles[0]) {
                newSrc = await fileToBase64(imageFiles[0]);
            }
            const updatedItemData = { ...formData, src: newSrc };
            if (updatedItemData.type === 'video') {
                if (videoFile) {
                    updatedItemData.localVideoSrc = await fileToBase64(videoFile);
                    updatedItemData.videoUrl = undefined;
                } else if (updatedItemData.videoUrl) {
                    updatedItemData.localVideoSrc = undefined;
                }
            } else {
                updatedItemData.localVideoSrc = undefined;
                updatedItemData.videoUrl = undefined;
            }
            onUpdate(gallery.map(g => g.id === editingItem.id ? { ...updatedItemData, id: editingItem.id } : g));
        } else {
            // Logic to add new items
            if (formData.type === 'image' && imageFiles.length > 0) {
                const newItems: GalleryImage[] = await Promise.all(
                    imageFiles.map(async file => {
                        const src = await fileToBase64(file);
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
                const thumbnailSrc = await fileToBase64(imageFiles[0]);
                let localVideo = undefined;
                if (videoFile) {
                    localVideo = await fileToBase64(videoFile);
                }
                const newItem: GalleryImage = {
                    ...formData,
                    id: generateId(),
                    src: thumbnailSrc,
                    localVideoSrc: localVideo,
                };
                onUpdate([...gallery, newItem]);
            }
        }
        setIsModalOpen(false);
    };

    const GalleryForm = ({ item, onSave, onCancel }: { item: GalleryImage | null, onSave: (data: Omit<GalleryImage, 'id'>, imageFiles: File[], videoFile: File | null) => void, onCancel: () => void }) => {
        const [formState, setFormState] = useState<Omit<GalleryImage, 'id'>>(() => {
            if (item) {
                const { id, ...rest } = item;
                return rest;
            }
            return { type: 'image', src: '', alt: '', category: 'Campus' };
        });
        const [imageFiles, setImageFiles] = useState<File[]>([]);
        const [videoFile, setVideoFile] = useState<File | null>(null);
        const [videoSourceType, setVideoSourceType] = useState<'url' | 'upload'>(() => {
            return item?.localVideoSrc ? 'upload' : 'url';
        });

        const handleVideoSourceChange = (type: 'url' | 'upload') => {
            setVideoSourceType(type);
            if (type === 'url') {
                setFormState(prev => ({ ...prev, localVideoSrc: undefined }));
                setVideoFile(null);
            } else {
                setFormState(prev => ({ ...prev, videoUrl: undefined }));
            }
        };


        return (
            <form onSubmit={(e) => { e.preventDefault(); onSave(formState, imageFiles, videoFile); }} className="flex-1 overflow-y-auto">
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
                            <label className="block text-sm font-medium mb-2">Video Source</label>
                            <div className="flex gap-4">
                                <label className="flex items-center"><input type="radio" name="videoSourceType" value="url" checked={videoSourceType === 'url'} onChange={() => handleVideoSourceChange('url')} className="mr-2"/> Embed URL</label>
                                <label className="flex items-center"><input type="radio" name="videoSourceType" value="upload" checked={videoSourceType === 'upload'} onChange={() => handleVideoSourceChange('upload')} className="mr-2"/> Upload Video</label>
                            </div>

                             {videoSourceType === 'upload' ? (
                                <div>
                                    <label className="block text-sm font-medium">Video File (Max 5MB)</label>
                                    <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100" required={!item?.localVideoSrc} />
                                </div>
                            ) : (
                                 <div>
                                    <label className="block text-sm font-medium">YouTube Embed URL</label>
                                    <input value={formState.videoUrl || ''} onChange={e => setFormState({...formState, videoUrl: e.target.value})} className="mt-1 block w-full p-2 border rounded-md bg-white" placeholder="https://www.youtube.com/embed/..." required={!item?.videoUrl} />
                                </div>
                            )}
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
// Vlogs Component
// ==========================================================
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

    const handleSave = async (formData: Omit<Vlog, 'id' | 'publicationDate'>, thumbnailFile: File | null, videoFile: File | null) => {
        let thumbnailUrl = formData.thumbnailUrl;
        let localVideoSrc = formData.localVideoSrc;

        if (thumbnailFile) {
            thumbnailUrl = await fileToBase64(thumbnailFile);
        }

        if (videoFile) {
            if (videoFile.size > 5 * 1024 * 1024) { // 5MB limit
                alert("Video file is too large. Please upload a file smaller than 5MB.");
                return;
            }
            localVideoSrc = await fileToBase64(videoFile);
        }

        const finalData = { ...formData, thumbnailUrl, localVideoSrc };

        if (editingVlog) {
            onUpdate(vlogs.map(v => v.id === editingVlog.id ? { ...editingVlog, ...finalData } : v));
        } else {
            onUpdate([...vlogs, { ...finalData, id: generateId(), publicationDate: new Date().toISOString().split('T')[0] }]);
        }
        setIsModalOpen(false);
    };

     const VlogForm = ({ vlog, onSave, onCancel }: { vlog: Vlog | null, onSave: (data: Omit<Vlog, 'id' | 'publicationDate'>, thumbnailFile: File | null, videoFile: File | null) => void, onCancel: () => void }) => {
        const [formState, setFormState] = useState(vlog || { title: '', description: '', sourceType: 'url' as 'url' | 'upload', videoUrl: '', thumbnailUrl: '', localVideoSrc: '' });
        const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
        const [videoFile, setVideoFile] = useState<File | null>(null);
        
        return (
             <form onSubmit={(e) => { e.preventDefault(); onSave(formState, thumbnailFile, videoFile); }} className="flex-1 overflow-y-auto">
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
                    <div>
                        <label className="block text-sm font-medium mb-2">Video Source</label>
                        <div className="flex gap-4">
                           <label className="flex items-center"><input type="radio" name="sourceType" value="url" checked={formState.sourceType === 'url'} onChange={() => setFormState({...formState, sourceType: 'url'})} className="mr-2"/> Embed URL</label>
                           <label className="flex items-center"><input type="radio" name="sourceType" value="upload" checked={formState.sourceType === 'upload'} onChange={() => setFormState({...formState, sourceType: 'upload'})} className="mr-2"/> Upload Video</label>
                        </div>
                    </div>
                    
                    {formState.sourceType === 'url' ? (
                         <div>
                            <label className="block text-sm font-medium">YouTube Embed URL</label>
                            <input value={formState.videoUrl} onChange={e => setFormState({...formState, videoUrl: e.target.value, localVideoSrc: ''})} className="mt-1 block w-full p-2 border rounded-md bg-white" placeholder="https://www.youtube.com/embed/..." required />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium">Video File (Max 5MB)</label>
                            <input type="file" accept="video/*" onChange={e => { setVideoFile(e.target.files ? e.target.files[0] : null); setFormState({...formState, videoUrl: ''}); }} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100" required={!vlog || !vlog.localVideoSrc} />
                        </div>
                    )}
                     
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
// Blogs Component
// ==========================================================
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
            imageUrl = await fileToBase64(imageFile);
        }

        const finalData = { ...formData, imageUrl };
        
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

    const BlogForm = ({ blog, onSave, onCancel }: { blog: BlogPost | null, onSave: (data: Omit<BlogPost, 'id'|'publicationDate'>, imageFile: File | null) => void, onCancel: () => void }) => {
        const [formState, setFormState] = useState(blog || { title: '', authorId: FACULTY_MEMBERS[0].id, excerpt: '', content: '', imageUrl: '', tags: [] });
        const [imageFile, setImageFile] = useState<File | null>(null);

        return (
            <form onSubmit={(e) => { e.preventDefault(); onSave(formState, imageFile); }} className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-4">
                    <input type="hidden" value={formState.imageUrl} />
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} className="mt-1 block w-full p-2 border rounded-md bg-white" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Author</label>
                        <select value={formState.authorId} onChange={e => setFormState({...formState, authorId: Number(e.target.value)})} className="mt-1 block w-full p-2 border rounded-md bg-white">
                            {FACULTY_MEMBERS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Excerpt</label>
                        <textarea value={formState.excerpt} onChange={e => setFormState({...formState, excerpt: e.target.value})} rows={2} className="mt-1 block w-full p-2 border rounded-md bg-white" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Content (HTML allowed)</label>
                        <textarea value={formState.content} onChange={e => setFormState({...formState, content: e.target.value})} rows={5} className="mt-1 block w-full p-2 border rounded-md bg-white" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Tags (comma-separated)</label>
                        <input value={Array.isArray(formState.tags) ? formState.tags.join(', ') : ''} onChange={e => setFormState({...formState, tags: e.target.value.split(',').map(t => t.trim())})} className="mt-1 block w-full p-2 border rounded-md bg-white" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Featured Image</label>
                        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100" />
                    </div>
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Save Post</button>
                </div>
            </form>
        );
    };

    return (
        <div className="space-y-4">
            <div className="text-right">
                <button onClick={handleAddNew} className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700">Create New Post</button>
            </div>
            {blogs.map(blog => (
                <div key={blog.id} className="flex items-center gap-4 border p-2 rounded-lg">
                    <img src={blog.imageUrl} alt={blog.title} className="w-24 h-16 object-cover rounded" />
                    <div className="flex-grow">
                        <p className="font-bold">{blog.title}</p>
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
// Popup Component
// ==========================================================
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
            imageUrl = await fileToBase64(imageFile);
        }

        const finalData = { ...formData, imageUrl };

        if (editingPopup) {
            onUpdate(popups.map(p => p.id === editingPopup.id ? { ...editingPopup, ...finalData } : p));
        } else {
            onUpdate([...popups, { ...finalData, id: generateId() }]);
        }
        setIsModalOpen(false);
    };

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
// Main Component
// ==========================================================
const ManageContentPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('Banners');

    const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
        try {
            const storedData = localStorage.getItem('siteContent');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                return parsed[key] || defaultValue;
            }
        } catch (e) {
            console.error(`Failed to parse ${key} from localStorage`, e);
        }
        return defaultValue;
    };

    const [banners, setBanners] = useState<HeroSlide[]>(() => loadFromLocalStorage('banners', HERO_SLIDES));
    const [gallery, setGallery] = useState<GalleryImage[]>(() => loadFromLocalStorage('gallery', GALLERY_IMAGES));
    const [vlogs, setVlogs] = useState<Vlog[]>(() => loadFromLocalStorage('vlogs', VLOGS));
    const [blogs, setBlogs] = useState<BlogPost[]>(() => loadFromLocalStorage('blogs', BLOG_POSTS));
    const [newsTicker, setNewsTicker] = useState<string[]>(() => loadFromLocalStorage('newsTicker', NEWS_TICKER_MESSAGES));
    const [popups, setPopups] = useState<PopupNotification[]>(() => loadFromLocalStorage('popups', POPUP_NOTIFICATION));

    useEffect(() => {
        try {
            const siteContent = { banners, gallery, vlogs, blogs, newsTicker, popups };
            localStorage.setItem('siteContent', JSON.stringify(siteContent));
        } catch (e) {
            console.error("Failed to save site content to localStorage", e);
        }
    }, [banners, gallery, vlogs, blogs, newsTicker, popups]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Banners': return <ManageBanners banners={banners} onUpdate={setBanners} />;
            case 'Gallery': return <ManageGallery gallery={gallery} onUpdate={setGallery} />;
            case 'Vlogs': return <ManageVlogs vlogs={vlogs} onUpdate={setVlogs} />;
            case 'Blogs': return <ManageBlogs blogs={blogs} onUpdate={setBlogs} />;
            case 'News Ticker': return <ManageNewsTicker messages={newsTicker} onUpdate={setNewsTicker} />;
            case 'Popup': return <ManagePopup popups={popups} onUpdate={setPopups} />;
            default: return null;
        }
    };

    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">Manage Site Content</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
                        {(['Banners', 'Gallery', 'Vlogs', 'Blogs', 'News Ticker', 'Popup'] as Tab[]).map(tab => (
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