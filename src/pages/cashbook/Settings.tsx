import { SettingsContainer } from "./styles";
import SettingsViewModel from "./Settings.viewmodel";
import SettingsHistoryView from "../../components/cashbook/settingsView/SettingsHistoryView";
import MemberView from "../../components/cashbook/settingsView/MemberView";


export default function SettingsPage() {
  
  const viewModel = SettingsViewModel();


  return (
    <>
      <SettingsContainer className="settings">
        <div className="set_top">
          <button className="prev"
            onClick={() => viewModel.navigate(-1)}
          />
          <h6>설정</h6>
        </div>

        <ul className="tab">
          <li className={viewModel.activeTab === 1 ? 'active' : ''}
            onClick={() => viewModel.setActiveTab(1)}
          >카테고리&결제수단</li>
          <li className={viewModel.activeTab === 2 ? 'active' : ''}
            onClick={() => viewModel.setActiveTab(2)}
          >멤버</li>
        </ul>

        {viewModel.activeTab === 1 && (
          <SettingsHistoryView />
        )}

        {viewModel.activeTab === 2 && (
          <MemberView />
        )}
      </SettingsContainer>
    </>
  )
}

