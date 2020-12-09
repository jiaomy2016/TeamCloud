// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useContext, useState } from 'react';
import { Member, ProjectMember } from '../model'
import { ErrorResult } from 'teamcloud';
import { Stack, Facepile, IFacepilePersona, PersonaSize, IRenderFunction, HoverCard, HoverCardType, Shimmer, ShimmerElementsGroup, ShimmerElementType, CommandBar, ICommandBarItemProps, Separator, Label, Text } from '@fluentui/react';
import { DetailCard, MembersForm, UserPersona } from '.';
import { api } from '../API';
import { ProjectContext } from '../Context';


export interface IMembersCardProps {
    // onEditMember: (member?: Member) => void;
}

export const MembersCard: React.FC<IMembersCardProps> = (props) => {

    const [addMembersPanelOpen, setAddMembersPanelOpen] = useState(false);

    const { user, project, members, onAddUsers } = useContext(ProjectContext);

    const _removeMember = async (member: Member) => {
        if (project && (member as ProjectMember)?.projectMembership !== undefined) {
            const result = await api.deleteProjectUser(member.user.id, project.organization, project.id);
            if (result.code !== 204 && (result as ErrorResult).errors) {
                console.error(result as ErrorResult);
            }
        }
    };

    const _removeButtonDisabled = (member: ProjectMember) =>
        member.projectMembership.role.toLowerCase() === 'owner';

    const _userIsProjectOwner = () => {
        if (project && members && user) {
            const role = user.projectMemberships?.find(m => m.projectId === project.id)?.role.toLowerCase();
            if (role)
                return role === 'owner' || role === 'admin';
        }
        return false;
    };

    const _getCommandBarItems = (): ICommandBarItemProps[] => [
        { key: 'addUser', text: 'Add', iconProps: { iconName: 'PeopleAdd' }, onClick: () => setAddMembersPanelOpen(true), disabled: !_userIsProjectOwner() },
    ];

    const _getMemberCommandBarItems = (member: ProjectMember): ICommandBarItemProps[] => [
        // { key: 'edit', text: 'Edit', iconProps: { iconName: 'EditContact' }, onClick: () => props.onEditMember(member) },
        { key: 'edit', text: 'Edit', iconProps: { iconName: 'EditContact' }, onClick: () => { } },
        { key: 'remove', text: 'Remove', iconProps: { iconName: 'UserRemove' }, disabled: _removeButtonDisabled(member), onClick: () => { _removeMember(member) } },
    ];

    const _getShimmerElements = (): JSX.Element => (
        <ShimmerElementsGroup
            shimmerElements={[
                { type: ShimmerElementType.circle, height: 48 },
                { type: ShimmerElementType.gap, width: 4 },
                { type: ShimmerElementType.circle, height: 48 },
                { type: ShimmerElementType.gap, width: 4 },
                { type: ShimmerElementType.circle, height: 48 }
            ]} />
    );

    const _facepilePersonas = (): IFacepilePersona[] => members?.map(m => ({
        personaName: m.graphUser?.displayName,
        imageUrl: m.graphUser?.imageUrl,
        data: m,
    })) ?? [];

    const _onRenderPersonaCoin: IRenderFunction<IFacepilePersona> = (props?: IFacepilePersona, defaultRender?: (props?: IFacepilePersona) => JSX.Element | null): JSX.Element | null => {
        if (defaultRender && props?.data) {
            let _onRenderPlainCard = (): JSX.Element | null => {
                let member: ProjectMember = props.data;
                return (
                    <Stack
                        tokens={{ padding: '20px 20px 0 20px' }}>
                        <Stack.Item>
                            <UserPersona user={member.graphUser} large />
                        </Stack.Item>
                        <Stack.Item>
                            <Separator />
                        </Stack.Item>
                        <Stack.Item>
                            <Stack horizontal horizontalAlign='space-between' verticalAlign='center'>
                                <Stack.Item>
                                    <Text>{member.projectMembership?.role ?? 'Unknown'}</Text>
                                </Stack.Item>
                                <Stack.Item>
                                    <CommandBar
                                        styles={{ root: { minWidth: '160px' } }}
                                        items={_getMemberCommandBarItems(member)}
                                        ariaLabel='Use left and right arrow keys to navigate between commands' />
                                </Stack.Item>
                            </Stack>
                        </Stack.Item>
                    </Stack>
                );
            };

            return (
                <HoverCard
                    instantOpenOnClick
                    type={HoverCardType.plain}
                    cardOpenDelay={1000}
                    plainCardProps={{ onRenderPlainCard: _onRenderPlainCard }}>
                    {defaultRender(props)}
                </HoverCard>
            );
        }

        return null;
    };

    const _personaCoinStyles = {
        cursor: 'pointer',
        selectors: {
            ':hover': {
                cursor: 'pointer'
            }
        }
    }

    return (
        <>
            <DetailCard
                title='Members'
                callout={members?.length.toString()}
                commandBarItems={_getCommandBarItems()}>
                <Shimmer
                    customElementsGroup={_getShimmerElements()}
                    isDataLoaded={members !== undefined}
                    width={152} >
                    <Facepile
                        styles={{ itemButton: _personaCoinStyles }}
                        personas={_facepilePersonas()}
                        personaSize={PersonaSize.size48}
                        maxDisplayablePersonas={20}
                        onRenderPersonaCoin={_onRenderPersonaCoin} />
                </Shimmer>
            </DetailCard>
            <MembersForm
                members={members}
                panelIsOpen={addMembersPanelOpen}
                onFormClose={() => setAddMembersPanelOpen(false)}
                onAddUsers={onAddUsers} />
        </>
    );
}