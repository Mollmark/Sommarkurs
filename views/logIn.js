surfSpoter.LogInView = Backbone.View.extend({

    template:_.template($('#logIn').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});