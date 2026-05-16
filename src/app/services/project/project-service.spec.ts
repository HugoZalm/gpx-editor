// project-state.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { ProjectService } from './project-service';
import { UtilsService } from '../utils-service';
import { GpxUtilsService } from '../gpx/utils/gpx-utils-service';
import { FileDownloadService } from '../download-service';

import {
  HzxProject,
  HzxGpx,
  HzxTrack,
  HzxRoute,
  HzxWaypoint,
} from './model/hzxProject';

describe('ProjectService', () => {
  let service: ProjectService;

  const utilsServiceMock = {
    getRandomColor: vi.fn(),
  };
  const gpxUtilsServiceMock = {
    // getRandomColor: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // utilsServiceMock.getRandomColor.mockReturnValue('#ff0000');
    // gpxUtilsServiceMock.getRandomColor.mockReturnValue('#ff0000');

    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        {
          provide: UtilsService,
          useValue: utilsServiceMock,
        },
        {
          provide: GpxUtilsService,
          useValue: gpxUtilsServiceMock,
        },
      ],
    });

    service = TestBed.inject(ProjectService);
  });

  /* -------------------------------------------------------------------------- */
  /*                                    HELPERS                                 */
  /* -------------------------------------------------------------------------- */

  function createTrack(id: string, name = 'track'): HzxTrack {
    return {
      metadata: {
        id,
        name,
        color: '#000000',
      },
      track: {} as any,
    };
  }

  function createRoute(id: string, name = 'route'): HzxRoute {
    return {
      metadata: {
        id,
        name,
        color: '#000000',
      },
      rout: {} as any,
    };
  }

  function createWaypoint(id: string, name = 'waypoint'): HzxWaypoint {
    return {
      metadata: {
        id,
        name,
        color: '#000000',
      },
      waypoint: {} as any,
    };
  }

  function createFile(id: string, name = 'file'): HzxGpx {
    return {
      metadata: {
        id,
        name,
        color: '#123456',
      },
      meta: {} as any,
      raw: {} as any,
      tracks: [],
      routes: [],
      waypoints: [],
    };
  }

  function createProject(): HzxProject {
    return {
      metadata: {
        id: 'project-1',
        name: 'Test Project',
        color: '#ffffff',
      },
      files: [],
    };
  }

  function createFullProject(): HzxProject {
    const project = createProject();
    const file1 = createFile('file-1');
    const file2 = createFile('file-2');
    const track1 = createTrack('track-1');
    const track2 = createTrack('track-2');
    const track3 = createTrack('track-3');
    const track4 = createTrack('track-4');
    const route1 = createRoute('route-1');
    const route2 = createRoute('route-2');
    const route3 = createRoute('route-3');
    const route4 = createRoute('route-4');
    const waypoint1 = createWaypoint('waypoint-1');
    const waypoint2 = createWaypoint('waypoint-2');
    const waypoint3 = createWaypoint('waypoint-3');
    const waypoint4 = createWaypoint('waypoint-4');

    service.addTrackToFile(track1, 'file-1');
    service.addTrackToFile(track2, 'file-1');
    service.addTrackToFile(track3, 'file-2');
    service.addTrackToFile(track4, 'file-2');
    // service.addRouteToFile(route1, 'file-1');
    // service.addRouteToFile(route2, 'file-1');
    // service.addRouteToFile(route3, 'file-2');
    // service.addRouteToFile(route4, 'file-2');
    // service.addWaypointToFile(waypoint1, 'file-1');
    // service.addWaypointToFile(waypoint2, 'file-1');
    // service.addWaypointToFile(waypoint3, 'file-2');
    // service.addWaypointToFile(waypoint4, 'file-2');
    service.addFileToProject(file1);
    service.addFileToProject(file2);

    return project;
  }

  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* -------------------------------------------------------------------------- */
  /*                              PROJECT LEVEL                              */
  /* -------------------------------------------------------------------------- */

  describe('setProject', () => {
    it('should set a project to the projectState', () => {
      const project = createProject();

      service.setProject(project);

      expect(service.project()).toEqual(project);
    });
  });

  describe('setEmptyProject', () => {
    it('should set an empty project to the projectState', () => {
      service.setEmptyProject();

      expect(service.project().metadata.name).toEqual('');
      expect(service.project().metadata.name).toEqual('');
      expect(service.project().metadata.name).toEqual('');
      expect(service.project().files).toHaveLength(0);
    });
  });

  describe('saveProject', () => {
    it('should download the project as json file', () => {
      const clickMock = vi.fn();

      const documentMock = {
        createElement: vi.fn().mockReturnValue({
          click: clickMock,
          href: '',
          download: ''
        })
      } as any;

      const fileDownloadService = new FileDownloadService(documentMock);

      const createObjectURLMock = vi
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue('blob:url');

      const revokeObjectURLMock = vi
        .spyOn(URL, 'revokeObjectURL')
        .mockImplementation(() => {});

      fileDownloadService.downloadJson({ hello: 'world' }, 'test.hzx');

      expect(documentMock.createElement).toHaveBeenCalledWith('a');
      expect(clickMock).toHaveBeenCalled();

      expect(createObjectURLMock).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:url');
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                                  FILE LEVEL                                */
  /* -------------------------------------------------------------------------- */


  /* -------------------------------------------------------------------------- */
  /*                                 TRACK LEVEL                                */
  /* -------------------------------------------------------------------------- */


  /* -------------------------------------------------------------------------- */
  /*                                 ROUTE LEVEL                                */
  /* -------------------------------------------------------------------------- */


  /* -------------------------------------------------------------------------- */
  /*                               WAYPOINT LEVEL                               */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                               ITEMS LEVEL                               */
  /* -------------------------------------------------------------------------- */

  describe('getItemById', () => {
    let project: HzxProject;
    let file1: HzxGpx;
    let track1: HzxTrack;
    let route1: HzxRoute;
    let waypoint1: HzxWaypoint;

    beforeEach(() => {  
      track1 = createTrack('track-1');
      const track2 = createTrack('track-2');
      const track3 = createTrack('track-3');
      const track4 = createTrack('track-4');
      route1 = createRoute('route-1');
      const route2 = createRoute('route-2');
      const route3 = createRoute('route-3');
      const route4 = createRoute('route-4');
      waypoint1 = createWaypoint('waypoint-1');
      const waypoint2 = createWaypoint('waypoint-2');
      const waypoint3 = createWaypoint('waypoint-3');
      const waypoint4 = createWaypoint('waypoint-4');

      file1 = createFile('file-1');
      file1.tracks = [track1, track2];
      file1.routes = [route1, route2];
      file1.waypoints = [waypoint1, waypoint2];
      const file2 = createFile('file-2');
      file2.tracks = [track3, track4];
      file2.routes = [route3, route4];
      file2.waypoints = [waypoint3, waypoint4];

      project = createProject();
      project.files = [file1, file2];

      service.setProject(project);

    });

    it('should return the project when projectId', () => {
      const projectId = service.project().metadata.id;
      const item = service.getItemById(projectId);

      expect(item).toBe(project);
    });
    it('should return the file with given id', () => {
      const item = service.getItemById('file-1');

      expect(item).toBe(file1);
    });
    it('should return the track with given id', () => {
      const item = service.getItemById('track-1');

      expect(item).toBe(track1);
    });
    it('should return the route with given id', () => {
      const item = service.getItemById('route-1');

      expect(item).toBe(route1);
    });
    it('should return the waypoint given id', () => {
      const item = service.getItemById('waypoint-1');

      expect(item).toBe(waypoint1);
    });
    it('should return undefined when unexisting id', () => {
      const item = service.getItemById('missing');

      expect(item).toBe(undefined);
    });
  });

  describe('getItemByIdWithParentId', () => {
    let project: HzxProject;
    let file1: HzxGpx;
    let track1: HzxTrack;
    let route1: HzxRoute;
    let waypoint1: HzxWaypoint;
    let projectId: string;

    beforeEach(() => {  
      track1 = createTrack('track-1');
      const track2 = createTrack('track-2');
      const track3 = createTrack('track-3');
      const track4 = createTrack('track-4');
      route1 = createRoute('route-1');
      const route2 = createRoute('route-2');
      const route3 = createRoute('route-3');
      const route4 = createRoute('route-4');
      waypoint1 = createWaypoint('waypoint-1');
      const waypoint2 = createWaypoint('waypoint-2');
      const waypoint3 = createWaypoint('waypoint-3');
      const waypoint4 = createWaypoint('waypoint-4');

      file1 = createFile('file-1');
      file1.tracks = [track1, track2];
      file1.routes = [route1, route2];
      file1.waypoints = [waypoint1, waypoint2];
      const file2 = createFile('file-2');
      file2.tracks = [track3, track4];
      file2.routes = [route3, route4];
      file2.waypoints = [waypoint3, waypoint4];

      project = createProject();
      project.files = [file1, file2];

      service.setProject(project);
      projectId = service.project().metadata.id;

    });

    it('should return the project when projectId', () => {
      const itemInfo = service.getItemByIdWithParentId(projectId);

      expect(itemInfo?.type).toBe('project');
      expect(itemInfo?.id).toBe(projectId);
      expect(itemInfo?.parentId).toBe(undefined);
      expect(itemInfo?.item).toBe(project);
    });
    it('should return the file with given id', () => {
      const itemInfo = service.getItemByIdWithParentId('file-1');

      expect(itemInfo?.type).toBe('gpx');
      expect(itemInfo?.id).toBe('file-1');
      expect(itemInfo?.parentId).toBe(projectId);
      expect(itemInfo?.item).toBe(file1);
    });
    it('should return the track with given id', () => {
      const itemInfo = service.getItemByIdWithParentId('track-1');

      expect(itemInfo?.type).toBe('track');
      expect(itemInfo?.id).toBe('track-1');
      expect(itemInfo?.parentId).toBe('file-1');
      expect(itemInfo?.item).toBe(track1);
    });
    it('should return the route with given id', () => {
      const itemInfo = service.getItemByIdWithParentId('route-1');

      expect(itemInfo?.type).toBe('route');
      expect(itemInfo?.id).toBe('route-1');
      expect(itemInfo?.parentId).toBe('file-1');
      expect(itemInfo?.item).toBe(route1);
    });
    it('should return the waypoint given id', () => {
      const itemInfo = service.getItemByIdWithParentId('waypoint-1');

      expect(itemInfo?.type).toBe('waypoint');
      expect(itemInfo?.id).toBe('waypoint-1');
      expect(itemInfo?.parentId).toBe('file-1');
      expect(itemInfo?.item).toBe(waypoint1);
    });
    it('should return undefined when unexisting id', () => {
      const itemInfo = service.getItemByIdWithParentId('missing');

      expect(itemInfo).toBe(undefined);
    });
  });

});
