import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { ContentType, InputFormat } from '@/types/content';
import { historyService, HistoryItem } from '@/services/historyService';
import { ApiError } from '@/lib/api';

// Context state interface
interface HomeViewState {
  // Content type selection
  selectedContentType: string;
  
  // Input states
  inputText: string;
  inputUrl: string;
  activeTab: InputFormat;
  
  // Generation states
  isGenerating: boolean;
  error: string | null;
  
  // Project data (when viewing existing project)
  projectData: HistoryItem | null;
  isLoadingProject: boolean;
  projectError: string | null;
}

// Context actions interface
interface HomeViewActions {
  setSelectedContentType: (type: string) => void;
  setInputText: (text: string) => void;
  setInputUrl: (url: string) => void;
  setActiveTab: (tab: InputFormat) => void;
  setIsGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  resetForm: () => void;
}

// Combined context interface
interface HomeViewContextType {
  state: HomeViewState;
  actions: HomeViewActions;
}

// Create context
const HomeViewContext = createContext<HomeViewContextType | undefined>(undefined);

// Provider props
interface HomeViewProviderProps {
  children: ReactNode;
}

// Provider component
export const HomeViewProvider: React.FC<HomeViewProviderProps> = ({ children }) => {
  const { uuid } = useParams<{ uuid: string }>();
  
  // Initial state
  const [state, setState] = useState<HomeViewState>({
    selectedContentType: ContentType.KEY_POINTS,
    inputText: '',
    inputUrl: '',
    activeTab: InputFormat.TEXT,
    isGenerating: false,
    error: null,
    projectData: null,
    isLoadingProject: false,
    projectError: null,
  });

  // Actions
  const actions: HomeViewActions = {
    setSelectedContentType: (type: string) => {
      setState(prev => ({ ...prev, selectedContentType: type }));
    },
    
    setInputText: (text: string) => {
      setState(prev => ({ ...prev, inputText: text }));
    },
    
    setInputUrl: (url: string) => {
      setState(prev => ({ ...prev, inputUrl: url }));
    },
    
    setActiveTab: (tab: InputFormat) => {
      setState(prev => ({ ...prev, activeTab: tab }));
    },
    
    setIsGenerating: (generating: boolean) => {
      setState(prev => ({ ...prev, isGenerating: generating }));
    },
    
    setError: (error: string | null) => {
      setState(prev => ({ ...prev, error }));
    },
    
    clearError: () => {
      setState(prev => ({ ...prev, error: null }));
    },
    
    resetForm: () => {
      setState(prev => ({
        ...prev,
        inputText: '',
        inputUrl: '',
        activeTab: InputFormat.TEXT,
        error: null,
      }));
    },
  };

  // Fetch project data if UUID is present
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!uuid) {
        // No UUID, reset to default state
        setState(prev => ({
          ...prev,
          projectData: null,
          isLoadingProject: false,
          projectError: null,
        }));
        return;
      }

      try {
        setState(prev => ({ ...prev, isLoadingProject: true, projectError: null }));
        
        const response = await historyService.getProjectDetails(uuid);
        const projectData = response.data;
        
        // Prefill the form with project data
        setState(prev => ({
          ...prev,
          projectData,
          selectedContentType: projectData.type,
          inputText: projectData.input || '',
          inputUrl: projectData.inputUrl || '',
          // Determine active tab based on what data is available
          activeTab: projectData.inputUrl ? InputFormat.URL : 
                    projectData.input ? InputFormat.TEXT : InputFormat.TEXT,
          isLoadingProject: false,
        }));
        
      } catch (err) {
        const apiError = err as ApiError;
        setState(prev => ({
          ...prev,
          projectError: apiError.message || 'Failed to load project',
          isLoadingProject: false,
        }));
        console.error('Error fetching project:', apiError);
      }
    };

    fetchProjectData();
  }, [uuid]);

  const contextValue: HomeViewContextType = {
    state,
    actions,
  };

  return (
    <HomeViewContext.Provider value={contextValue}>
      {children}
    </HomeViewContext.Provider>
  );
};

// Custom hook to use the context
export const useHomeView = (): HomeViewContextType => {
  const context = useContext(HomeViewContext);
  if (context === undefined) {
    throw new Error('useHomeView must be used within a HomeViewProvider');
  }
  return context;
}; 