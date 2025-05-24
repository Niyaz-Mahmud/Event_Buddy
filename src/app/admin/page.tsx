'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { events as appEvents, Event } from '@/lib/data/events';

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

// Types
interface FileHandlerProps {
  imagePreview: string | null;
  isDragging: boolean;
  onFileChange: (file: File) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onBrowseClick: () => void;
  onRemoveImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number;
  rows?: number;
  min?: string;
  icon?: React.ReactNode;
}

// Components
const FileHandler: React.FC<FileHandlerProps> = ({
  imagePreview, isDragging, onFileChange, onDragOver, onDragLeave, 
  onDrop, onBrowseClick, onRemoveImage, fileInputRef
}) => (
  <div 
    className={`mt-1 flex items-center p-4 border-2 border-dashed rounded-lg ${
      isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
    } ${imagePreview ? 'bg-gray-50' : ''}`}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
  >
    {imagePreview ? (
      <div className="w-full flex flex-col items-center">
        <img src={imagePreview} alt="Preview" className="max-h-48 max-w-full mb-2 rounded" />
        <button type="button" onClick={onRemoveImage} className="text-sm text-red-600 hover:text-red-800">
          Remove image
        </button>
      </div>
    ) : (
      <>
        <div className="bg-gray-100 rounded-full p-4 mr-3">
          <svg className="h-8 w-8 text-blue-900" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <div className="text-sm">
            Drag or <span className="text-blue-600 cursor-pointer" onClick={onBrowseClick}>upload</span> the picture here
          </div>
          <div className="text-xs text-gray-500">Max. 5MB | JPG, PNG</div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0])}
          accept={ALLOWED_FILE_TYPES.join(',')}
          className="hidden"
        />
        <button
          type="button"
          onClick={onBrowseClick}
          className="ml-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Browse
        </button>
      </>
    )}
  </div>
);

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

const FormField: React.FC<FormFieldProps> = ({ 
  label, type = 'text', placeholder, defaultValue, rows, min, icon 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      {rows ? (
        <textarea
          rows={rows}
          defaultValue={defaultValue}
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          min={min}
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      )}
      {icon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
    </div>
  </div>
);

const ActionButton: React.FC<{ onClick: () => void; title: string; color: string; children: React.ReactNode }> = ({ 
  onClick, title, color, children 
}) => (
  <button onClick={onClick} className={`text-${color}-600 hover:text-${color}-900`} title={title}>
    {children}
  </button>
);

const CalendarIcon = () => (
  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function AdminDashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [eventsList, setEventsList] = useState<Event[]>(appEvents);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  
  const handleDelete = useCallback((eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEventsList(prev => prev.filter(event => event.id !== eventId));
    }
  }, []);
  
  const handleEdit = useCallback((event: Event) => {
    setCurrentEvent(event);
    setShowEditModal(true);
  }, []);

  const handleFile = useCallback((file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      alert('File is too large. Maximum size is 5MB.');
      return;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert('Only JPG and PNG files are allowed.');
      return;
    }
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleBrowseClick = useCallback(() => fileInputRef.current?.click(), []);
  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null);
    setImagePreview(null);
  }, []);

  const closeModal = useCallback(() => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setUploadedImage(null);
    setImagePreview(null);
  }, []);

  const fileHandlerProps = useMemo(() => ({
    imagePreview, isDragging, onFileChange: handleFile, onDragOver: handleDragOver,
    onDragLeave: handleDragLeave, onDrop: handleDrop, onBrowseClick: handleBrowseClick,
    onRemoveImage: handleRemoveImage, fileInputRef
  }), [imagePreview, isDragging, handleFile, handleDragOver, handleDragLeave, handleDrop, handleBrowseClick, handleRemoveImage]);

  const EventForm = ({ event }: { event?: Event }) => (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <FormField label="Title" defaultValue={event?.title} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField 
          label="Date" 
          placeholder="dd/mm/yyyy" 
          defaultValue={event?.date} 
          icon={<CalendarIcon />} 
        />
        <FormField 
          label="Time" 
          placeholder="e.g. 09:00 AM - 11:00 AM" 
          defaultValue={event?.time} 
          icon={<ClockIcon />} 
        />
      </div>
      
      <FormField label="Description" rows={4} defaultValue={event?.description} />
      <FormField label="Event Location" defaultValue={event?.location} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Capacity" type="number" min="1" defaultValue={event?.capacity} />
        <FormField 
          label="Tags (comma separated)" 
          defaultValue={event?.tags.join(', ')} 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
        <FileHandler {...fileHandlerProps} />
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {event ? 'Update' : 'Create Event'}
        </button>
      </div>
    </form>
  );
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    } else if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isAdmin, router]);
  
  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage events, view registrations, and monitor your platform.</p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Events Management</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Event
            </button>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Title', 'Date', 'Location', 'Registrations', 'Actions'].map(header => (
                      <th key={header} className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {eventsList.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-blue-900">{event.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">{event.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">{event.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">{event.registrations}/{event.capacity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-5">
                          <ActionButton onClick={() => router.push(`/events/${event.id}`)} title="View" color="blue">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </ActionButton>
                          <ActionButton onClick={() => handleEdit(event)} title="Edit" color="blue">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </ActionButton>
                          <ActionButton onClick={() => handleDelete(event.id)} title="Delete" color="red">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {eventsList.map((event) => (
                <div key={event.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-medium text-blue-900 flex-1 mr-2">{event.title}</h3>
                    <div className="flex items-center space-x-3">
                      <ActionButton onClick={() => router.push(`/events/${event.id}`)} title="View" color="blue">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </ActionButton>
                      <ActionButton onClick={() => handleEdit(event)} title="Edit" color="blue">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </ActionButton>
                      <ActionButton onClick={() => handleDelete(event.id)} title="Delete" color="red">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </ActionButton>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Location:</span>
                      <span className="text-right">{event.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Registrations:</span>
                      <span>{event.registrations}/{event.capacity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Modal isOpen={showCreateModal} onClose={closeModal} title="Create New Event">
        <EventForm />
      </Modal>

      <Modal isOpen={showEditModal} onClose={closeModal} title="Edit Event">
        <EventForm event={currentEvent || undefined} />
      </Modal>
    </div>
  );
} 