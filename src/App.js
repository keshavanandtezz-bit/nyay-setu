import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import CitizenHome from './pages/citizen/CitizenHome';
import StatusTracker from './pages/citizen/StatusTracker';
import RightsBot from './pages/citizen/RightsBot';
import LegalAidFinder from './pages/citizen/LegalAidFinder';
import CourtCalendar from './pages/citizen/CourtCalendar';
import LegalHome from './pages/legal/LegalHome';
import NyayMitra from './pages/legal/NyayMitra';
import PrecedentFinder from './pages/legal/PrecedentFinder';
import UndertrialAlerts from './pages/legal/UndertrialAlerts';
import BailGenerator from './pages/legal/BailGenerator';
import NyayYatra from './pages/citizen/NyayYatra';
import FileComplaint from './pages/citizen/FileComplaint';
import CaseJourney from './pages/citizen/CaseJourney';
import CourtFinder from './pages/citizen/CourtFinder';
import NotFound from './pages/NotFound';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/citizen" element={<CitizenHome />} />
        <Route path="/citizen/status" element={<StatusTracker />} />
        <Route path="/citizen/rights" element={<RightsBot />} />
        <Route path="/citizen/legal-aid" element={<LegalAidFinder />} />
        <Route path="/citizen/calendar" element={<CourtCalendar />} />
        <Route path="/legal" element={<LegalHome />} />
        <Route path="/legal/nyay-mitra" element={<NyayMitra />} />
        <Route path="/legal/precedents" element={<PrecedentFinder />} />
        <Route path="/legal/alerts" element={<UndertrialAlerts />} />
        <Route path="/legal/bail" element={<BailGenerator />} />
        <Route path="/citizen/nyay-yatra" element={<NyayYatra />} />
        <Route path="/citizen/file-complaint" element={<FileComplaint />} />
        <Route path="/citizen/case/:caseId" element={<CaseJourney />} />
        <Route path="/citizen/courts" element={<CourtFinder />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}