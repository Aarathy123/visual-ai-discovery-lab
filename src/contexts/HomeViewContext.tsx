import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { ContentType, InputFormat } from '@/types/content';
import { historyService, HistoryItem } from '@/services/historyService';
import { contentGenerationService } from '@/services/contentGenerationService';
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
  handleGenerate: () => Promise<void>;
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

    handleGenerate: async () => {
      try {
        setState(prev => ({ ...prev, isGenerating: true, error: null }));

        // Validate input based on active tab
        if (state.activeTab === InputFormat.URL && !state.inputUrl.trim()) {
          setState(prev => ({ ...prev, error: 'Please enter a URL' }));
          return;
        }
        if (state.activeTab === InputFormat.TEXT && !state.inputText.trim()) {
          setState(prev => ({ ...prev, error: 'Please enter some text' }));
          return;
        }
        if (state.activeTab === InputFormat.FILE) {
          setState(prev => ({ ...prev, error: 'File upload not implemented yet' }));
          return;
        }

        // Make API call based on input format
        const response = await contentGenerationService.generateContent(
          state.selectedContentType as ContentType,
          state.activeTab,
          {
            url: state.inputUrl,
            text: state.inputText,
          }
        );

        console.log('Generation response:', response.data);
        
        // Handle successful generation
        if (response.data.status === 'completed') {
          // Update projectData state with the response data (same structure as history/UUID)
          const projectData: HistoryItem = {
            _id: response.data.id,
            type: response.data.type,
            prompt: '', // Not provided in process response
            input: state.inputText,
            inputUrl: state.inputUrl,
            url: '', // Not provided in process response
            result: response.data.result || '',
            resultUrl: response.data.resultUrl || '',
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
            __v: 0, // Not provided in process response
          };
          
          setState(prev => ({
            ...prev,
            projectData,
            isGenerating: false,
          }));
          
          console.log('Content generation completed successfully');
        } else if (response.data.status === 'processing') {
          // TODO: Implement polling mechanism for long-running tasks
          console.log('Content generation is still processing');
          setState(prev => ({ ...prev, isGenerating: false }));
        } else if (response.data.status === 'failed') {
          setState(prev => ({ 
            ...prev, 
            error: 'Content generation failed',
            isGenerating: false 
          }));
        }
        
      } catch (err) {
        const apiError = err as ApiError;
        setState(prev => ({ 
          ...prev, 
          error: apiError.message || 'Failed to generate content',
          isGenerating: false 
        }));
        console.error('Error generating content:', apiError);
      }
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