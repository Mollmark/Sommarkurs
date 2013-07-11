surfSpoter.GoSurfView = Backbone.View.extend({

    template:_.template($('#goSurf').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});