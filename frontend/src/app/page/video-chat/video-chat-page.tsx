import React from 'react';
import { RouteComponentProps } from 'react-router';

import { Layout } from 'antd';
import Jitsi from 'react-jitsi';

import { connectContext, SettingsProps } from 'app/context';
import { PageContent } from 'app/components/layout';
import { navigationService } from 'app/service/navigation-service';

const { Content } = Layout;

interface ContextProps {
    username: string | null;
    teacherLessons: Api.Lesson[];
    userRoles: string[] | null;
}

type OwnProps = RouteComponentProps<Params>;

interface Params {
    id: string;
}

type Props = OwnProps & ContextProps;

class HomePageComponent extends React.Component<Props, {}> {

    public render(): React.ReactNode {
        const {
            username,
            teacherLessons,
            userRoles,
            match: {
                params: { id },
            },
        } = this.props;

        const currentLesson = teacherLessons && teacherLessons.filter((lesson) => lesson.id === parseInt(id, 10));

        const isUserInWrongVideoRoom = teacherLessons &&
            !teacherLessons.map(lesson => lesson.id).includes(parseInt(id, 10));

        if (isUserInWrongVideoRoom) {
            navigationService.redirectToDefaultPage();
        }
        const videoChatName: string = currentLesson && currentLesson[0].video.toString();

        return (
            <Layout>
                <Content style={{ margin: 'auto', width: '70%' }}>
                    <PageContent>
                        {videoChatName && (
                            <Jitsi

                                frameStyle={{ display: 'block', width: '150%', height: '150%' }}

                                jwt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cHM6Ly9hdmF0YXJzLmRpY2ViZWFyLmNvbS9hcGkvbWFsZS9tZW51by1zdS1pdC5zdmciLCJuYW1lIjoiTcSXbnVvIHN1IElUIn19LCJhdWQiOiJtZW51b19zdV9pdCIsImlzcyI6Im1lbnVvX3N1X2l0Iiwic3ViIjoibWVldC5qaXRzaSIsInJvb20iOiIqIn0.6CKZU_JWLhtj9eKJ-VdFGQZyRzvTZz29fn7--_dp-jw"
                                roomName={videoChatName}
                                domain="video-menuo-su-it.northeurope.cloudapp.azure.com:443"
                                userInfo={{ email: username }}
                                displayName={username}
                                onAPILoad={handleCallEnd}
                                config={{
                                    startAudioMuted: 1,
                                    remoteVideoMenu: {
                                        disableKick: userRoles[0] === 'STUDENT',
                                    },
                                    disableRemoteMute: userRoles[0] === 'STUDENT',
                                }}
                                interfaceConfig={userRoles[0] === 'STUDENT' &&
                                    {
                                        TOOLBAR_BUTTONS: [
                                            'microphone', 'camera', 'desktop', 'fullscreen', 'raisehand', 'hangup', 'chat',
                                            'tileview', 'download', 'videoquality', 'filmstrip', 'invite', 'feedback',
                                            'stats', 'shortcuts',
                                        ],
                                    } || {

                                        SHOW_WATERMARK_FOR_GUESTS: false, SHOW_JITSI_WATERMARK: false,
                                    }
                                }
                            />
                        )}
                        {/*<Whiteboard/>*/}
                    </PageContent>
                </Content>
            </Layout>
        );
    }

    private readonly generateUniqueName = (subject: string, video: string): string =>
        subject + ' ' + video;

    private readonly handleClickToDefaultPage = (): void => {
        navigationService.redirectToDefaultPage();
    };
}

const handleCallEnd = (api: any) => {
    api.executeCommand('startRecording', {
        mode: 'file',
        shouldShare: true,
    });

    api.addEventListener('readyToClose', () => {
        navigationService.redirectToDefaultPage();
    });
};

const mapContextToProps = ({ session: { user }, lessons }: SettingsProps): ContextProps => ({
    username: user != null ? user.username : null,
    userRoles: user.roles,
    teacherLessons: lessons,
    // studentLessons: lessons,
});

const VideoChatPage = connectContext(mapContextToProps)(HomePageComponent);

export { VideoChatPage };
