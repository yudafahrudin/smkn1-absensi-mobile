import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, ListItem, Header, Text, Badge, Button } from 'react-native-elements';
import _ from 'lodash';
import { getHomeParent } from '../../actions/parent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EmptyText from '../../components/EmptyText';
import moment from 'moment';

class HomeParentScreen extends React.Component {

    componentDidMount = () => {
        this.startingHomeData()
    }

    startingHomeData = async () => {
        const { actions } = this.props;
        await actions.getHomeParent();
    }

    getColorBadge = (status) => {
        if (status == 'hadir') {
            return 'success';
        }
        if (status == 'sedang berjalan') {
            return 'primary';
        }
        if (status == 'belum di mulai') {
            return 'primary';
        }
        return 'warning';
    }

    getDayName = (name) => {
        switch (name) {
            case 'Sun':
                return "Minggu";
            case 'Mon':
                return "Senin";
            case 'Tue':
                return "Selasa";
            case 'Wed':
                return "Rabu";
            case 'Thu':
                return "Kamis";
            case 'Fri':
                return "Jumat";
            case 'Sat':
                return "Sabtu";
            default:
                return "Liburan";
        }
    }

    render() {
        const { home, user } = this.props;
        const { absenToday } = home;

        if (home) {
            return (
                <>
                    <Header
                        containerStyle={{ backgroundColor: '#3b5998' }}
                        centerComponent={{
                            text: 'HOME',
                            style: { fontSize: 20, fontWeight: 'bold', color: '#fff' }
                        }}
                    />
                    <ScrollView style={
                        {
                            height: '100%',
                            padding: 5,
                            backgroundColor: '#f0f0f0'
                        }}
                    >
                        <View style={{ marginBottom: 50 }}>
                            <Card>
                                <Card.Title style={{ fontSize: 20, fontWeight: '500' }}>
                                    JADWAL ANAK ANDA HARI INI
                                </Card.Title>
                                <Card.Divider />
                                <View>
                                    <Text style={{ textAlign: 'center', fontSize: 16 }}>
                                        Hari {this.getDayName(moment().format('ddd'))}
                                    </Text>
                                    {
                                        !_.isEmpty(absenToday) ? (absenToday.map((l, i) => (
                                            <ListItem key={i} bottomDivider>
                                                <ListItem.Content>
                                                    <ListItem.Title style={{ color: '#000' }}>
                                                        <Text style={{ fontSize: 20 }}>
                                                            {l.subject.name} -
                                                        </Text>
                                                        <Text style={{ fontSize: 15 }}>
                                                            {"   "} {l.start_at} - {l.end_at}
                                                        </Text>
                                                    </ListItem.Title>
                                                    <ListItem.Subtitle>
                                                        <Badge
                                                            badgeStyle={{ marginVertical: 10, padding: 15 }} status={this.getColorBadge(l.absenteeism)}
                                                            value={<Text style={{ fontSize: 15, color: 'white' }}>
                                                                {l.absenteeism}
                                                            </Text>}
                                                        />

                                                    </ListItem.Subtitle>
                                                </ListItem.Content>
                                            </ListItem>
                                        ))) : (<EmptyText />)
                                    }
                                </View>
                                <Button
                                    containerStyle={{ marginTop: 50 }}
                                    onPress={() => this.props.navigation.navigate('AllRecapitulation')}
                                    title="Lihat Semua Rekapitulasi" />
                            </Card>
                        </View>
                    </ScrollView>
                </>
            )
        } else {
            return (<></>)
        }
    }

}

const mapStateToProps = (state) => ({
    home: _.get(state.parent, 'home'),
    user: _.get(state.session, 'user'),
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            getHomeParent,
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeParentScreen);


