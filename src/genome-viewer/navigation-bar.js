/*
 * Copyright (c) 2012 Francisco Salavert (ICM-CIPF)
 * Copyright (c) 2012 Ruben Sanchez (ICM-CIPF)
 * Copyright (c) 2012 Ignacio Medina (ICM-CIPF)
 *
 * This file is part of JS Common Libs.
 *
 * JS Common Libs is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * JS Common Libs is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JS Common Libs. If not, see <http://www.gnu.org/licenses/>.
 */

function NavigationBar(args) {

    // Using Underscore 'extend' function to extend and add Backbone Events
    _.extend(this, Backbone.Events);

    var _this = this;

    this.id = Utils.genId("NavigationBar");

    this.species = 'Homo sapiens';
    this.increment = 3;
    this.zoom;

    //set instantiation args, must be last
    _.extend(this, args);

    //set new region object
    this.region = new Region(this.region);

    this.currentChromosomeList = [];

    this.on(this.handlers);

    this.zoomChanging = false;

    this.rendered = false;
    if (this.autoRender) {
        this.render();
    }
};

NavigationBar.prototype = {

    render: function (targetId) {
        var _this = this;
        this.targetId = (targetId) ? targetId : this.targetId;
        if ($('#' + this.targetId).length < 1) {
            console.log('targetId not found in DOM');
            return;
        }


//        <label class="btn btn-primary"><input type="checkbox"> Option 1</label>
        var navgationHtml = '' +
            '<div class="btn-toolbar" role="toolbar">' +
            '   <div class="btn-group btn-group-xs">' +
            '       <button id="restoreDefaultRegionButton" class="btn btn-default" type="button"><span class="glyphicon glyphicon-repeat"></span></button>' +
            '   </div>' +
            '   <div class="btn-group btn-group-xs">' +
            '       <button id="regionHistoryButton" class="btn btn-default dropdown-toggle" data-toggle="dropdown"  type="button" ><span class="glyphicon glyphicon-time"></span> <span class="caret"></button>' +
            '       <ul id="regionHistoryMenu" class="dropdown-menu" role="menu">' +
            '       </ul>' +
            '   </div>' +
            '   <div class="btn-group btn-group-xs">' +
            '       <button id="speciesButton" class="btn btn-default dropdown-toggle" data-toggle="dropdown"  type="button" >' +
            '           <span id="speciesText"></span>&nbsp;<span class="caret"></span>' +
            '       </button>' +
            '       <ul id="speciesMenu" class="dropdown-menu" role="menu">' +
            '       </ul>' +
            '   </div>' +
            '   <div class="btn-group btn-group-xs">' +
//            '       <div class="pull-left" style="height:22px;line-height: 22px;color:#708090">Chr&nbsp;</div>' +
            '       <button id="chromosomesButton" class="btn btn-default dropdown-toggle" data-toggle="dropdown"  type="button" >' +
            '           <span id="chromosomesText"></span>&nbsp;<span class="caret"></span>' +
            '       </button>' +
            '       <ul id="chromosomesMenu" class="dropdown-menu" role="menu">' +
            '       </ul>' +
            '   </div>' +
            '   <div class="btn-group btn-group-xs" data-toggle="buttons">' +
            '       <label id="karyotypeButton" class="btn btn-default"><input type="checkbox"><span class="ocb-icon ocb-icon-karyotype"></span></label>' +
            '       <label id="chromosomeButton" class="btn btn-default"><input type="checkbox"><span class="ocb-icon ocb-icon-chromosome"></span></label>' +
            '       <label id="regionButton" class="btn btn-default"><input type="checkbox"><span class="ocb-icon ocb-icon-region"></span></label>' +
            '   </div>' +
            '   <div class="btn-group btn-group-xs">' +
            '       <button id="zoomOutButton" class="btn btn-default btn-xs" type="button"><span class="glyphicon glyphicon-minus"></span></button>' +
            '       <div id="progressBarCont" class="progress pull-left" style="width:200px;height:10px;margin:5px 2px 0px 2px;background-color: #d5d5d5">' +
            '           <div id="progressBar" class="progress-bar" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">' +
            '           </div>' +
            '       </div>' +

            '       <button id="zoomInButton" class="btn btn-default btn-xs" type="button"><span class="glyphicon glyphicon-plus"></span></button>' +
            '   </div>' +
            '   <div class="btn-group btn-group-xs" style="margin:0px 0px 0px 15px;">' +
            '       <div class="pull-left" style="height:22px;line-height: 22px;font-size:14px;">Position:&nbsp;</div>' +
            '       <div class="input-group pull-left">' +
            '           <input id="regionField" style="width:200px;height:22px" type="text" class="form-control">' +
            '       </div>' +
            '       <button id="goButton" class="btn btn-default btn-xs" type="button">Go!</button>' +
            '   </div>' +
            '   <div class="btn-group btn-group-xs">' +
            '       <button id="moveFurtherLeftButton" class="btn btn-default" type="button"><span class="ocb-icon ocb-icon-arrow-w-bold"></span></button>' +
            '       <button id="moveLeftButton" class="btn btn-default" type="button"><span class="ocb-icon ocb-icon-arrow-w"></span></button>' +
            '       <button id="moveRightButton" class="btn btn-default" type="button"><span class="ocb-icon ocb-icon-arrow-e"></span></button>' +
            '       <button id="moveFurtherRightButton" class="btn btn-default" type="button"><span class="ocb-icon ocb-icon-arrow-e-bold"></span></button>' +
            '   </div>' +
            '   <div class="btn-group btn-group-xs">' +
            '       <button id="autoheightButton" class="btn btn-default" type="button"><span class="glyphicon glyphicon-resize-vertical"></span></button>' +
            '   </div>' +
            '   <div class="btn-group pull-right">' +
            '       <div class="pull-left" style="height:22px;line-height: 22px;font-size:14px;">Search:&nbsp;</div>' +
            '       <div class="input-group pull-left">' +
            '           <input id="searchField"  type="text" class="form-control" placeholder="gene, snp..." style="height:22px;width:100px">' +
            '       </div>' +
            '       <button id="goButton" class="btn btn-default btn-xs" type="button"><span class="glyphicon glyphicon-search"></span></button>' +
            '   </div>' +
            '</div>' +
            '';


        this.targetDiv = $('#' + this.targetId)[0];
        this.div = $('<div id="navigation-bar" class="gv-navigation-bar unselectable">' + navgationHtml + '</div>')[0];
        $(this.targetDiv).append(this.div);


        this.restoreDefaultRegionButton = $(this.div).find('#restoreDefaultRegionButton')[0];

        this.regionHistoryButton = $(this.div).find('#regionHistoryButton')[0];
        this.regionHistoryMenu = $(this.div).find('#regionHistoryMenu')[0];

        this.speciesButton = $(this.div).find('#speciesButton')[0];
        this.speciesText = $(this.div).find('#speciesText')[0];
        this.speciesMenu = $(this.div).find('#speciesMenu')[0];

        this.chromosomesButton = $(this.div).find('#chromosomesButton')[0];
        this.chromosomesText = $(this.div).find('#chromosomesText')[0];
        this.chromosomesMenu = $(this.div).find('#chromosomesMenu')[0];

        this.karyotypeButton = $(this.div).find('#karyotypeButton')[0];
        this.chromosomeButton = $(this.div).find('#chromosomeButton')[0];
        this.regionButton = $(this.div).find('#regionButton')[0];

        this.progressBar = $(this.div).find('#progressBar')[0];
        this.progressBarCont = $(this.div).find('#progressBarCont')[0];
        this.zoomOutButton = $(this.div).find('#zoomOutButton')[0];
        this.zoomInButton = $(this.div).find('#zoomInButton')[0];

        this.regionField = $(this.div).find('#regionField')[0];
        this.goButton = $(this.div).find('#goButton')[0];

        this.moveFurtherLeftButton = $(this.div).find('#moveFurtherLeftButton');
        this.moveFurtherRightButton = $(this.div).find('#moveFurtherRightButton');
        this.moveLeftButton = $(this.div).find('#moveLeftButton');
        this.moveRightButton = $(this.div).find('#moveRightButton');

        this.autoheightButton = $(this.div).find('#autoheightButton');

        /*** ***/
        $(this.restoreDefaultRegionButton).click(function (e) {
            _this.trigger('restoreDefaultRegion:click', {clickEvent: e, sender: {}})
        });

        this._addRegionHistoryMenuItem(this.region);
        this._setChromosomeMenu();
        this._setSpeciesMenu();
        $(this.chromosomesText).text(this.region.chromosome);
        $(this.speciesText).text(this.species.text);


        $(this.karyotypeButton).click(function () {
            _this.trigger('karyotype-button:change', {selected: $(this).hasClass('active'), sender: _this});
        });
        $(this.chromosomeButton).click(function () {
            _this.trigger('chromosome-button:change', {selected: $(this).hasClass('active'), sender: _this});
        });
        $(this.regionButton).click(function () {
            _this.trigger('region-button:change', {selected: $(this).hasClass('active'), sender: _this});
        });


        $(this.zoomOutButton).click(function () {
            _this._handleZoomOutButton();
        });
        $(this.zoomInButton).click(function () {
            _this._handleZoomInButton();
        });
        $(this.progressBarCont).click(function (e) {
            var zoom = 100 / $(this).width() * e.offsetX;
            if (!_this.zoomChanging) {
                $(_this.progressBar).width(e.offsetX);
                _this.zoomChanging = true;
                setTimeout(function () {
                    _this._handleZoomSlider(zoom);
                    _this.zoomChanging = false;
                }, 1000);
            }
        });
        $(this.regionField).val(this.region.toString());

        $(this.goButton).click(function () {
            _this._goRegion($(_this.regionField).val());
        });

        $(this.moveFurtherLeftButton).click(function () {
            _this._handleMoveRegion(10);
        });

        $(this.moveFurtherRightButton).click(function () {
            _this._handleMoveRegion(-10);
        });

        $(this.moveLeftButton).click(function () {
            _this._handleMoveRegion(1);
        });

        $(this.moveRightButton).click(function () {
            _this._handleMoveRegion(-1);
        });

        $(this.autoheightButton).click(function (e) {
            _this.trigger('autoHeight-button:click', {clickEvent: e, sender: _this});
        });


        var speciesCode = Utils.getSpeciesCode(this.species.text).substr(0, 3);
        var url = CellBaseManager.url({
            host: 'http://ws.bioinfo.cipf.es/cellbase/rest',
            species: speciesCode,
            version: 'latest',
            category: 'feature',
            subCategory: 'id',
            query: '%QUERY',
            resource: 'starts_with',
            params: {
                of: 'json'
            }
        });

        $(this.div).find('#searchField').typeahead({
            remote: {
                url: url,
                filter: function (parsedResponse) {
                    return parsedResponse[0];
                }
            },
            valueKey: 'displayId',
            limit: 20
        }).bind('typeahead:selected', function (obj, datum) {
                _this._goFeature(datum.displayId);
            });

        $(this.div).find('#searchField').parent().find('.tt-hint').addClass('form-control tt-query').css({
            height: '22px'
        });


        this.rendered = true;
    },

    _addRegionHistoryMenuItem: function (region) {
        var _this = this;
//        <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Action</a></li>
        var menuEntry = $('<li role="presentation"><a tabindex="-1" role="menuitem">' + region.toString() + '</a></li>')[0];
        $(this.regionHistoryMenu).append(menuEntry);
        $(menuEntry).click(function () {
            _this.region.parse($(this).text());
            _this._recalculateZoom();
            _this.trigger('region:change', {region: _this.region, sender: _this});
            console.log($(this).text());
        });
    },

    _setChromosomeMenu: function () {
        var _this = this;

        $(this.chromosomesMenu).empty();

        //find species object
        var list = [];
        for (var i in this.availableSpecies.items) {
            for (var j in this.availableSpecies.items[i].items) {
                var species = this.availableSpecies.items[i].items[j];
                if (species.text === this.species.text) {
                    list = species.chromosomes;
                    break;
                }
            }
        }

        this.currentChromosomeList = list;
        //add bootstrap elements to the menu
        for (var i in list) {
            var menuEntry = $('<li role="presentation"><a tabindex="-1" role="menuitem">' + list[i] + '</a></li>')[0];
            $(this.chromosomesMenu).append(menuEntry);
            $(menuEntry).click(function () {
                $(_this.chromosomesText).text($(this).text());
                _this.region.chromosome = $(this).text();
                _this._recalculateZoom();
                _this._addRegionHistoryMenuItem(_this.region);
                _this.trigger('region:change', {region: _this.region, sender: _this});
                console.log($(this).text());
            });
        }
    },

    _setSpeciesMenu: function () {
        var _this = this;

        var createEntry = function (species) {
            var menuEntry = $('<li role="presentation"><a tabindex="-1" role="menuitem">' + species.text + '</a></li>')[0];
            $(_this.speciesMenu).append(menuEntry);
            $(menuEntry).click(function () {
                _this.species = species;
                $(_this.speciesText).text($(this).text());
                _this._setChromosomeMenu();
                _this.trigger('species:change', {species: species, sender: _this});
            });
        };
        //find species object
        var list = [];
        for (var i in this.availableSpecies.items) {
            for (var j in this.availableSpecies.items[i].items) {
                var species = this.availableSpecies.items[i].items[j];
                createEntry(species);
            }
        }
    },

    _goRegion: function (value) {
        var reg = new Region();
        if (!reg.parse(value) || reg.start < 0 || reg.end < 0 || _.indexOf(this.currentChromosomeList, reg.chromosome) == -1) {
            $(this.regionField).css({opacity: 0.0});
            $(this.regionField).animate({opacity: 1}, 700);
        } else {
            this.region.load(reg);
            $(this.chromosomesText).text(this.region.chromosome);
            this._recalculateZoom();
            this._addRegionHistoryMenuItem(this.region);
            this.trigger('region:change', {region: this.region, sender: this});
        }
    },

//    _quickSearch: function (query) {
//        var results = [];
//        var speciesCode = Utils.getSpeciesCode(this.species.text).substr(0, 3);
////        var host = new CellBaseManager().host;
//        var host = 'http://ws.bioinfo.cipf.es/cellbase/rest';
//        $.ajax({
//            url: host + '/latest/' + speciesCode + '/feature/id/' + query.term + '/starts_with?of=json',
//            async: false,
//            dataType: 'json',
//            success: function (data, textStatus, jqXHR) {
//                for (var i in data[0]) {
//                    results.push(data[0][i].displayId);
//                }
//            },
//            error: function (jqXHR, textStatus, errorThrown) {
//                console.log(textStatus);
//            }
//        });
//        return results;
//    },

    _goFeature: function (featureName) {
        if (featureName != null) {
            if (featureName.slice(0, "rs".length) == "rs" || featureName.slice(0, "AFFY_".length) == "AFFY_" || featureName.slice(0, "SNP_".length) == "SNP_" || featureName.slice(0, "VAR_".length) == "VAR_" || featureName.slice(0, "CRTAP_".length) == "CRTAP_" || featureName.slice(0, "FKBP10_".length) == "FKBP10_" || featureName.slice(0, "LEPRE1_".length) == "LEPRE1_" || featureName.slice(0, "PPIB_".length) == "PPIB_") {
                this.openSNPListWidget(featureName);
            } else {
                console.log(featureName);
                // TO-DO: gene list widget to be implemented
                // this.openGeneListWidget(featureName);

                // meanwhile the location of feature is set
                console.log(this.species);
                var _this = this;

                CellBaseManager.get({
                    species: this.species,
                    category: 'feature',
                    subCategory: 'gene',
                    query: featureName,
                    resource: 'info',
                    params: {
                        include: 'chromosome,start,end'
                    },
                    success: function (data) {
                        var feat = data.response[0].result[0];
                        var regionStr = feat.chromosome + ":" + feat.start + "-" + feat.end;
                        var region = new Region();
                        region.parse(regionStr);
                        _this.region = region;
                        _this.trigger('region:change', {region: _this.region, sender: _this});
                    }
                });
            }
        }
    },

    _handleZoomOutButton: function () {
        this._handleZoomSlider(Math.max(0, this.zoom - 1));
//        $(this.zoomSlider).slider("value", this.zoom);
        $(this.progressBar).css("width", this.zoom + '%');
    },
    _handleZoomSlider: function (value) {
        this.zoom = value;
        this.region.load(this._calculateRegionByZoom());
        $(this.regionField).val(this.region.toString());
        this._addRegionHistoryMenuItem(this.region);
        this.trigger('region:change', {region: this.region, sender: this});
    },
    _handleZoomInButton: function () {
        this._handleZoomSlider(Math.min(100, this.zoom + 1));
//        $(this.zoomSlider).slider("value", this.zoom);
        $(this.progressBar).css("width", this.zoom + '%');
    },

    _handleMoveRegion: function (positions) {
        var pixelBase = (this.width - this.svgCanvasWidthOffset) / this.region.length();
        var disp = Math.round((positions * 10) / pixelBase);
        this.region.start -= disp;
        this.region.end -= disp;
        $(this.regionField).val(this.region.toString());
        this.trigger('region:move', {region: this.region, disp: disp, sender: this});
    },

    setVisible: function (obj) {
        for (key in obj) {
            var query = $(this.div).find('#' + key);
            if (obj[key]) {
                query.show();
            } else {
                query.hide();
            }
        }
    },

    setRegion: function (region) {
        this.region.load(region);
        $(this.chromosomesText).text(this.region.chromosome);
        $(this.regionField).val(this.region.toString());
        this._recalculateZoom();
        this._addRegionHistoryMenuItem(region);
    },
    moveRegion: function (region) {
        this.region.load(region);
        $(this.chromosomesText).text(this.region.chromosome);
        $(this.regionField).val(this.region.toString());
        this._recalculateZoom();
    },

    setWidth: function (width) {
        this.width = width;
        this._recalculateZoom();
    },

    _recalculateZoom: function () {
        this.zoom = this._calculateZoomByRegion();
//        $(this.zoomSlider).slider("value", this.zoom);
        $(this.progressBar).css("width", this.zoom + '%');
    },

    draw: function () {
        if (!this.rendered) {
            console.info(this.id + ' is not rendered yet');
            return;
        }
    },
    _calculateRegionByZoom: function () {
        var zoomBaseLength = (this.width - this.svgCanvasWidthOffset) / Utils.getPixelBaseByZoom(this.zoom);
        var centerPosition = this.region.center();
        var aux = Math.ceil((zoomBaseLength / 2) - 1);
        var start = Math.floor(centerPosition - aux);
        var end = Math.floor(centerPosition + aux);
        return {start: start, end: end};
    },
    _calculateZoomByRegion: function () {
        return Utils.getZoomByPixelBase((this.width - this.svgCanvasWidthOffset) / this.region.length());
    },

    _handleNavigationBar: function (action, args) {
////	var _this = this;
//        if (action == 'OptionMenuClick') {
//            this.genomeWidget.showTranscripts = Ext.getCmp("showTranscriptCB").checked;
//            this.genomeWidgetProperties.setShowTranscripts(Ext.getCmp("showTranscriptCB").checked);
//            this.refreshMasterGenomeViewer();
//        }
////        if (action == 'ZOOM'){
////            this.setZoom(args);
////            this.onRegionChange.notify({sender:"zoom"});
////        }
        if (action == 'GoToGene') {
            var geneName = Ext.getCmp(this.id + 'quickSearch').getValue();
            if (geneName != null) {
                if (geneName.slice(0, "rs".length) == "rs" || geneName.slice(0, "AFFY_".length) == "AFFY_" || geneName.slice(0, "SNP_".length) == "SNP_" || geneName.slice(0, "VAR_".length) == "VAR_" || geneName.slice(0, "CRTAP_".length) == "CRTAP_" || geneName.slice(0, "FKBP10_".length) == "FKBP10_" || geneName.slice(0, "LEPRE1_".length) == "LEPRE1_" || geneName.slice(0, "PPIB_".length) == "PPIB_") {
                    this.openSNPListWidget(geneName);
                } else {
                    this.openGeneListWidget(geneName);
                }
            }
        }
//        if (action == '+'){
////  	var zoom = this.genomeWidgetProperties.getZoom();
//            var zoom = this.zoom;
//            if (zoom < 100){
//                this.setZoom(zoom + this.increment);
//            }
//        }
//        if (action == '-'){
////    	 var zoom = this.genomeWidgetProperties.getZoom();
//            var zoom = this.zoom;
//            if (zoom >= 5){
//                this.setZoom(zoom - this.increment);
//            }
//        }

//        if (action == 'Go') {
//            var value = Ext.getCmp(this.id + 'tbCoordinate').getValue();
//
//            var reg = new Region({str: value});
//
//            // Validate chromosome and position
//            if (isNaN(reg.start) || reg.start < 0) {
//                Ext.getCmp(this.id + 'tbCoordinate').markInvalid("Position must be a positive number");
//            }
//            else if (Ext.getCmp(this.id + "chromosomeMenu").almacen.find("name", reg.chromosome) == -1) {
//                Ext.getCmp(this.id + 'tbCoordinate').markInvalid("Invalid chromosome");
//            }
//            else {
//                this.region.load(reg);
////            this.onRegionChange.notify({sender:"GoButton"});
//                this._recalculateZoom();
//
//                this.trigger('region:change', {region: this.region, sender: this});
//            }
//
//        }
    },
    setSpeciesVisible: function (bool) {
        if (bool) {
            Ext.getCmp(this.id + "speciesMenuButton").show();
        } else {
            Ext.getCmp(this.id + "speciesMenuButton").hide();
        }
    },
    setChromosomeMenuVisible: function (bool) {
        if (bool) {
            Ext.getCmp(this.id + "chromosomeMenuButton").show();
        } else {
            Ext.getCmp(this.id + "chromosomeMenuButton").hide();
        }
    },
    setKaryotypePanelButtonVisible: function (bool) {
        this.karyotypeButton.setVisible(bool);
    },
    setChromosomePanelButtonVisible: function (bool) {
        this.chromosomeButton.setVisible(bool);
    },
    setRegionOverviewPanelButtonVisible: function (bool) {
        this.regionButton.setVisible(bool);
    },
    setRegionTextBoxVisible: function (bool) {
        if (bool) {
            Ext.getCmp(this.id + "positionLabel").show();
            Ext.getCmp(this + "tbCoordinate").show();
            Ext.getCmp(this.id + "GoButton").show();
        } else {
            Ext.getCmp(this.id + "positionLabel").hide();
            Ext.getCmp(this.id + "tbCoordinate").hide();
            Ext.getCmp(this.id + "GoButton").hide();
        }
    },
    setSearchVisible: function (bool) {
        if (bool) {
            this.searchComboBox.show();
            Ext.getCmp(this.id + "GoToGeneButton").show();
        } else {
            this.searchComboBox.hide();
            Ext.getCmp(this.id + "GoToGeneButton").hide();
        }
    },
    setFullScreenButtonVisible: function (bool) {
        this.fullscreenButton.setVisible(bool);
    }

}