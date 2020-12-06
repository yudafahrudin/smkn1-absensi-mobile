import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, ListItem, Header, Text, Badge, Button } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import _ from 'lodash';
import { getHomeParent } from '../../actions/parent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

class FormAbsentScreen extends React.Component {

    state = {
        type: 'absen',
    }

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
        const { type } = this.state;
        const { home, user } = this.props;
        const { absenToday } = home;

        if (home) {
            return (
                <>
                    <Header
                        containerStyle={{ backgroundColor: '#3b5998' }}
                        centerComponent={{
                            text: 'FORM ABSENSI',
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
                                <Card.Title>
                                    Anda Belum Mengajukan Absensi Hari Ini
                                </Card.Title>
                            </Card>
                            <Card>
                                <View style={{
                                    borderRadius: 40,
                                    borderWidth: 1,
                                    borderColor: 'rgba(110, 120, 170, 1)',
                                    marginBottom: 10,
                                }}>
                                    <Picker
                                        selectedValue={type}
                                        style={{
                                            height: 45,
                                            width: '100%'
                                        }}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setType(itemValue)
                                        }}>
                                        <Picker.Item label="absen" value="absen" />
                                        <Picker.Item label="izin" value="izin" />
                                        <Picker.Item label="sakit" value="sakit" />
                                        <Picker.Item label="lainnya" value="lainnya" />
                                    </Picker>
                                </View>
                                <Button
                                    containerStyle={{ marginTop: 20 }}
                                    onPress={() => this.props.navigation.navigate('AllRecapitulation')}
                                    title="AJUKAN" />
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

export default connect(mapStateToProps, mapDispatchToProps)(FormAbsentScreen);


