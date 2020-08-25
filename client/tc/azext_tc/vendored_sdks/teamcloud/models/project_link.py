# coding=utf-8
# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
#
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
# --------------------------------------------------------------------------

from msrest.serialization import Model


class ProjectLink(Model):
    """ProjectLink.

    :param id:
    :type id: str
    :param href:
    :type href: str
    :param title:
    :type title: str
    :param type:
    :type type: int
    """

    _attribute_map = {
        'id': {'key': 'id', 'type': 'str'},
        'href': {'key': 'href', 'type': 'str'},
        'title': {'key': 'title', 'type': 'str'},
        'type': {'key': 'type', 'type': 'int'},
    }

    def __init__(self, **kwargs):
        super(ProjectLink, self).__init__(**kwargs)
        self.id = kwargs.get('id', None)
        self.href = kwargs.get('href', None)
        self.title = kwargs.get('title', None)
        self.type = kwargs.get('type', None)
