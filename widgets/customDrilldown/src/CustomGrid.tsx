const CustomButton = () => {
    let { Grid } = Stage.Basic;
    // const theDict = [{
    //     'manager': '<fmclient.v1.alarm.AlarmManager object at 0x7f771a53df60>',
    //     '_info': {
    //         'mgmt_affecting': 'True',
    //         'degrade_affecting': 'False',
    //         'severity': 'critical',
    //         'entity_instance_id': 'cluster=97b54872-5180-469d-8ba9-fbc0c8127db3.peergroup=group-0',
    //         'timestamp': '2022-02-01T11:39:07.541796',
    //         'alarm_id': '800.010',
    //         'reason_text': 'Potential data loss. No available OSDs in storage replication group  group-0: OSDs are down',
    //         'suppression_status': 'unsuppressed',
    //         'uuid': 'c1e2dc86-e7af-4b02-aee1-44e47b24f4ba'
    //     },
    //     'mgmt_affecting': 'True',
    //     'degrade_affecting': 'False',
    //     'severity': 'critical',
    //     'entity_instance_id': 'cluster=97b54872-5180-469d-8ba9-fbc0c8127db3.peergroup=group-0',
    //     'timestamp': '2022-02-01T11:39:07.541796',
    //     'alarm_id': '800.010',
    //     'reason_text': 'Potential data loss. No available OSDs in storage replication group  group-0: OSDs are down',
    //     'suppression_status': 'unsuppressed', 'uuid': 'c1e2dc86-e7af-4b02-aee1-44e47b24f4ba',
    //     '_loaded': 'True'
    // }]
    const theDict = [{'a': {'b': 'B', 'c': 'C'}}]

    return (
        <Grid columns="equal">
            <Grid.Row>
                <Grid.Column textAlign="center" verticalAlign="middle">
                    <p>{theDict[0]}</p>
                </Grid.Column>

                <Grid.Column textAlign="center" verticalAlign="middle">
                    <p>Column 2</p>
                </Grid.Column>
                <Grid.Column textAlign="center" verticalAlign="middle">
                    <p>Column 3</p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column textAlign="center" verticalAlign="middle">
                    <p>Column 1</p>
                </Grid.Column>

                <Grid.Column textAlign="center" verticalAlign="middle">
                    <p>Column 2</p>
                </Grid.Column>
                <Grid.Column textAlign="center" verticalAlign="middle">
                    <p>Column 3</p>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default CustomButton;
