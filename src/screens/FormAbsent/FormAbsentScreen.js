import React from 'react';
import { ScrollView, View, ActivityIndicator, Alert } from 'react-native';
import { Card, ListItem, Header, Text, Badge, Button, Input, Image, Overlay } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import _ from 'lodash';
import { submitAbsentParent, getHomeParent } from '../../actions/parent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EmptyText from '../../components/EmptyText';
import moment from 'moment';

class FormAbsentScreen extends React.Component {

    state = {
        reasons: 'absen',
        description: null,
        image: null,
        isOverlay: false,
        imageInformation: null
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

    setReasons = (reasons) => {
        this.setState({
            reasons: reasons
        })
    }

    setDescription = (description) => {
        console.log(description);
        this.setState({
            description: description
        })
    }

    getPhoto = () => {
        ImagePicker.openPicker({
            cropping: true
        }).then(image => {
            this.setState({
                image: image.path,
                imageInformation: image
            })
        }).catch(error => {
        })
    }

    getPhotoByCamera = () => {
        ImagePicker.openCamera({
            cropping: true,
            freeStyleCropEnabled: true,
        }).then(image => {
            this.setState({
                image: image.path,
                imageInformation: image
            })
        }).catch(error => {
        })
    }

    deletePhoto = () => {
        this.setState({
            image: null,
            imageInformation: null
        })
    }

    setOverlay = () => {
        const { isOverlay } = this.state;
        this.setState({
            isOverlay: !isOverlay
        })
    }

    submitAbsent = async () => {

        const { actions, navigation } = this.props;
        const { reasons, imageInformation, description } = this.state;

        // const date = new Date();
        const date = moment(new Date()).format('X');
        const data = new FormData();

        data.append('date', date);
        data.append('reasons', reasons);
        data.append('description', description);

        if (imageInformation) {
            data.append('foto', {
                uri: Platform.OS === 'ios' ?
                    `file:///${imageInformation.path}` : imageInformation.path,
                type: imageInformation.mime,
                name: 'photo_absention'
            })
        }
        this.setOverlay()
        await actions.submitAbsentParent(data).then(async (result) => {
            console.log('22', result);
            if (result) {
                const { data } = result;
                const { status, message } = data;
                if (status == 'error') {
                    setTimeout(() => {
                        this.setOverlay()
                        Alert.alert('Error', message)
                    }, 1000)
                } else {
                    await actions.getHomeParent();
                    setTimeout(() => {
                        navigation.navigate('HomeParentScreen')
                    }, 500);
                }
            }
        });
    }


    render() {
        const { reasons, image, isOverlay } = this.state;
        const { home } = this.props;
        const { absenToday } = home;

        return (
            <>
                <Header
                    containerStyle={{ backgroundColor: '#3b5998' }}
                    centerComponent={{
                        text: 'FORM ABSENSI',
                        style: { fontSize: 20, fontWeight: 'bold', color: '#fff' }
                    }}
                />
                <Overlay isVisible={isOverlay}>
                    <Text>Mohon Tunggu...</Text>
                </Overlay>
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
                                ABSENSI HARI INI
                                </Card.Title>
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
                        </Card>
                        <Card>
                            <View style={{
                                borderRadius: 20,
                                borderWidth: 1,
                                paddingVertical: 10,
                                borderColor: 'rgba(110, 120, 170, 1)',
                                marginBottom: 10,
                            }}>
                                <Picker
                                    selectedValue={reasons}
                                    style={{
                                        height: 45,
                                        width: '100%'
                                    }}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setReasons(itemValue)
                                    }}>
                                    <Picker.Item label="absen" value="absen" />
                                    <Picker.Item label="izin" value="izin" />
                                    <Picker.Item label="sakit" value="sakit" />
                                    <Picker.Item label="lainnya" value="lainnya" />
                                </Picker>
                            </View>
                            {
                                !image ? (
                                    <View style={{
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        height: 300,
                                        borderColor: 'rgba(110, 120, 170, 1)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginVertical: 20
                                    }}>
                                        <Text style={{ fontSize: 20, color: 'rgba(110, 120, 170, 1)', }}>
                                            No Image
                                        </Text>
                                    </View>
                                ) : null
                            }
                            {
                                image ? (<Image
                                    source={{ uri: image }}
                                    style={{ height: 500, marginVertical: 10 }}
                                    PlaceholderContent={<ActivityIndicator />}
                                />) : (<></>)
                            }
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                                {
                                    image ? (<Button title="Hapus" onPress={this.deletePhoto} />) : null
                                }

                                <Button title="Buka galeri" onPress={this.getPhoto} />
                                <Button title="Ambil foto" onPress={this.getPhotoByCamera} />
                            </View>
                            <Input
                                placeholder='Deskripsi'
                                onChangeText={this.setDescription}
                                multiline={true}
                                numberOfLines={5}
                            />
                            <Button
                                containerStyle={{ marginTop: 20 }}
                                onPress={() => this.submitAbsent()}
                                title="AJUKAN" />
                        </Card>
                    </View>
                </ScrollView>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    home: _.get(state.parent, 'home'),
    user: _.get(state.session, 'user'),
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            submitAbsentParent,
            getHomeParent
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormAbsentScreen);


