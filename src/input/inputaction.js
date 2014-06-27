GE.InputActionType = {
    UNDEFINED: -1,
    BUTTON: 0,
    AXIS: 1
};

GE.InputAction = GE.Klass({

    name: "",

    actionType: GE.InputActionType.UNDEFINED,

    actionKey: null

});
