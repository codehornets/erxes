import { UserHeader } from "@erxes/ui-contacts/src/customers/styles";
import { __, renderFullName } from "coreui/utils";

import ActionSection from "@erxes/ui-contacts/src/customers/containers/ActionSection";
import ActivityInputs from "@erxes/ui-log/src/activityLogs/components/ActivityInputs";
import ActivityLogs from "@erxes/ui-log/src/activityLogs/containers/ActivityLogs";
import { ICustomer } from "../../types";
import { IField } from "@erxes/ui/src/types";
import { IFieldsVisibility } from "@erxes/ui-contacts/src/customers/types";
import Icon from "@erxes/ui/src/components/Icon";
import InfoSection from "@erxes/ui-contacts/src/customers/components/common/InfoSection";
import LeadState from "@erxes/ui-contacts/src/customers/containers/LeadState";
import LeftSidebar from "./LeftSidebar";
import React from "react";
import RightSidebar from "./RightSidebar";
import { TabTitle } from "@erxes/ui/src/components/tabs";
import Widget from "@erxes/ui-engage/src/containers/Widget";
import Wrapper from "@erxes/ui/src/layout/components/Wrapper";
import { isEnabled } from "@erxes/ui/src/utils/core";
import PrintAction from "@erxes/ui-contacts/src/customers/components/common/PrintAction";
import EmailWidget from "@erxes/ui-inbox/src/inbox/components/EmailWidget";

type Props = {
  customer: ICustomer;
  fieldsVisibility: (key: string) => IFieldsVisibility;
  deviceFields: IField[];
  fields: IField[];
  taggerRefetchQueries?: any[];
  deviceFieldsVisibility: (key: string) => IFieldsVisibility;
};

class CustomerDetails extends React.Component<Props> {
  renderEmailTab = () => {
    const { customer } = this.props;

    if (!customer.primaryEmail) {
      return null;
    }

    return (
      (isEnabled("engages") || isEnabled("imap")) && (
        <EmailWidget
          buttonStyle="link"
          emailTo={customer.primaryEmail}
          buttonText={__("New email")}
          type="tab"
        />
      )
    );
  };

  renderExtraTabs = () => {
    const triggerMessenger = (
      <>
        <Icon icon="comment-plus" /> {__("New message")}
      </>
    );

    if (isEnabled("engages")) {
      return (
        <TabTitle>
          <Widget
            customers={[this.props.customer]}
            modalTrigger={triggerMessenger}
            channelType="messenger"
            forceCreateConversation={true}
          />
          {this.renderEmailTab()}
        </TabTitle>
      );
    }

    return null;
  };

  render() {
    const {
      customer,
      deviceFields,
      fields,
      taggerRefetchQueries,
      fieldsVisibility,
      deviceFieldsVisibility
    } = this.props;

    const breadcrumb = [
      { title: __("Contacts"), link: "/contacts" },
      { title: renderFullName(customer) }
    ];

    const content = (
      <>
        <ActivityInputs
          contentTypeId={customer._id}
          contentType="contacts:customer"
          toEmail={customer.primaryEmail}
          showEmail={false}
          extraTabs={this.renderExtraTabs()}
        />
        {
          <ActivityLogs
            target={customer.firstName}
            contentId={customer._id}
            contentType="contacts:customer"
            extraTabs={[
              { name: "inbox:conversation", label: "Conversation" },
              { name: "imap:email", label: "Email" },
              { name: "tasks:task", label: "Task" },
              // { name: 'sms', label: 'SMS' },
              { name: "engages:campaign", label: "Campaign" }
            ]}
          />
        }
      </>
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={renderFullName(customer)}
            breadcrumb={breadcrumb}
          />
        }
        mainHead={
          <UserHeader>
            <InfoSection avatarSize={40} customer={customer}>
              {isEnabled("documents") && (
                <PrintAction coc={customer} contentType="contacts:customer" />
              )}
              <ActionSection customer={customer} />
            </InfoSection>
            <LeadState customer={customer} />
          </UserHeader>
        }
        leftSidebar={
          <LeftSidebar
            wide={true}
            customer={customer}
            fieldsVisibility={fieldsVisibility}
            deviceFields={deviceFields}
            fields={fields}
            taggerRefetchQueries={taggerRefetchQueries}
            deviceFieldsVisibility={deviceFieldsVisibility}
          />
        }
        rightSidebar={<RightSidebar customer={customer} />}
        content={content}
        transparent={true}
      />
    );
  }
}

export default CustomerDetails;
