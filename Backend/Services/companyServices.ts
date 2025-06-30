import { sendInvitationLink } from "../Config/email_config";
import { IAdminRepository } from "../Interfaces/admin.repository.interface";
import { AdminDoc } from "../Model/adminModal";
import {
  CompanyDoc,
  CompanyInput,
  CompanyMemberDoc,
} from "../Model/companyModal";
import { IMember } from "../Interfaces/commonInterface";
import { ICompanyRepository } from "../Interfaces/company.repository.interface";
import { ICompanyService } from "../Interfaces/company.service.interface";
import { IProjectRepository } from "../Interfaces/project.repository.interface";
import { IUserRepository } from "../Interfaces/user.repository.interface";
import { IPaymentRepository } from "../Interfaces/payment.repository.interface";
import { HttpError } from "../Utils/HttpError";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { UserDoc } from "../Model/userModal";
import { ProjectDoc } from "../Model/projectModal";
import { PaymentDoc } from "../Model/paymentModal";
class CompanyServices implements ICompanyService {
  private companyRepository: ICompanyRepository;
  private adminRepository: IAdminRepository;
  private userRepository: IUserRepository;
  private projectRepository: IProjectRepository;
  private paymentRepository: IPaymentRepository;
  constructor(
    companyRepository: ICompanyRepository,
    adminRepository: IAdminRepository,
    userRepository: IUserRepository,
    projectRepository: IProjectRepository,
    paymentRepository: IPaymentRepository
  ) {
    this.companyRepository = companyRepository;
    this.adminRepository = adminRepository;
    this.userRepository = userRepository;
    this.projectRepository = projectRepository;
    this.paymentRepository = paymentRepository;
  }
  companyDetails = async (
    companyData: CompanyInput,
    admin_id: string
  ): Promise<AdminDoc> => {
    const companyTwoAlphabets = companyData.companyName.slice(0, 2);
    const generatedOtp: string = Math.floor(
      1000 + Math.random() * 9000
    ).toString();
    const refferalCode: string = companyTwoAlphabets + generatedOtp;
    companyData.refferalCode = refferalCode;
    const companyName: string = companyData.companyName;
    const existCompanyData: CompanyDoc | null =
      await this.companyRepository.existCompanyData(companyName);
    if (existCompanyData) {
      throw new HttpError(
        HTTP_statusCode.Conflict, // 409 Conflict
        "Company data already exists"
      );
    }

    const companyDetails: CompanyDoc | null =
      await this.companyRepository.companyDetails(companyData);
    if (!companyDetails)
      throw new HttpError(HTTP_statusCode.NotFound, "No company Id Exist");
    const companyId = companyDetails._id;
    const adminData: AdminDoc | null =
      await this.adminRepository.updateCompanyDetails(companyId, admin_id);
    if (!adminData) {
      throw new HttpError(
        HTTP_statusCode.NotFound, // 404
        "No admin data found"
      );
    }

    if (!companyDetails) {
      throw new HttpError(
        HTTP_statusCode.NotFound, // 404
        "No company data found"
      );
    }
    const members: string[] = companyDetails.members.map(
      (member) => member.email
    );
    for (const member of members) {
      const isMailSended = await sendInvitationLink(member, refferalCode);
      if (!isMailSended) {
        throw new HttpError(
          HTTP_statusCode.InternalServerError, // 500
          "Failed to send email"
        );
      }
    }
    return adminData;
  };
  companyMembers = async (admin_id: string): Promise<CompanyMemberDoc[]> => {
    try {
      const adminData: AdminDoc | null =
        await this.adminRepository.findByAdminId(admin_id);
      if (!adminData) {
        throw new HttpError(HTTP_statusCode.NotFound, "Admin data not found");
      }

      const companyId = adminData.companyId;
      if (!companyId)
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "company Id does not exist"
        );
      const companyData: CompanyDoc | null =
        await this.companyRepository.companyFindById(companyId);

      if (!companyData) {
        throw new HttpError(HTTP_statusCode.NotFound, "Company not found");
      }

      const members: CompanyMemberDoc[] = companyData.members;

      if (!members.length) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "No members found for this company"
        );
      }
      const sortedMembers = members.sort((a, b) => {
        return (
          new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime()
        );
      });
      return sortedMembers;
    } catch (error: unknown) {
      throw error;
    }
  };
  searchMembers = async (
    admin_id: string,
    searchQuery: string,
    selectedProject: ProjectDoc | null
  ): Promise<CompanyMemberDoc[] | UserDoc[]> => {
    try {
      if (selectedProject?._id) {
        const projectData: ProjectDoc | null =
          await this.projectRepository.findProjectById(selectedProject._id);
        if (!projectData) {
          throw new HttpError(
            HTTP_statusCode.NotFound,
            "No project data found"
          );
        }
        const memberEmails: string[] = projectData.members.map(
          (member) => member.email
        );
        const users: UserDoc[] = await this.userRepository.searchProjectMembers(
          memberEmails,
          searchQuery
        );
        return users;
      } else {
        const adminData: AdminDoc | null =
          await this.adminRepository.findByAdminId(admin_id);
        if (!adminData || !adminData.companyId) {
          throw new HttpError(HTTP_statusCode.NotFound, "Admin data not found");
        }

        const companyData: CompanyDoc | null =
          await this.companyRepository.companyFindById(adminData.companyId);

        if (!companyData) {
          throw new HttpError(HTTP_statusCode.NotFound, "Company not found");
        }
        const matchedMembers: CompanyMemberDoc[] = companyData.members
          .filter((member) => new RegExp(searchQuery, "i").test(member.email)) // Filter by email
          .sort(
            (a, b) =>
              new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime()
          );
        return matchedMembers;
      }
    } catch (error: unknown) {
      throw error;
    }
  };

  companyData = async (admin_id: string): Promise<string> => {
    try {
      const adminData: AdminDoc | null =
        await this.adminRepository.findByAdminId(admin_id);
      if (!adminData?.companyId) {
        throw new HttpError(HTTP_statusCode.NotFound, "Admin data not found");
      }

      const companyId = adminData.companyId;
      const companyData: CompanyDoc | null =
        await this.companyRepository.companyFindById(companyId);

      if (!companyData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "Company data not available"
        );
      }
      return companyData.companyName;
    } catch (error: unknown) {
      throw error;
    }
  };
  inviationUsers = async (
    admin_id: string,
    members: IMember[]
  ): Promise<CompanyMemberDoc[]> => {
    try {
      const adminData: AdminDoc | null =
        await this.adminRepository.findByAdminId(admin_id);
      if (!adminData?.companyId) {
        throw new HttpError(HTTP_statusCode.NotFound, "Admin data not found");
      }

      const companyId: string = adminData.companyId;
      const companyData: CompanyDoc | null =
        await this.companyRepository.companyFindById(companyId);

      if (!companyData) {
        throw new HttpError(HTTP_statusCode.NotFound, "Company data not found");
      }

      const updatedCompany: CompanyDoc | null =
        await this.companyRepository.updateCompanyDetails(companyId, members);

      if (!updatedCompany) {
        throw new HttpError(
          HTTP_statusCode.Conflict,
          "No company members were modified"
        );
      }
      const companyMembers: CompanyMemberDoc[] = updatedCompany.members.sort(
        (a, b) =>
          new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime()
      );
      const refferalCode: string = companyData.refferalCode;
      const newMembers: string[] = members.map((member) => member.email);
      for (const member of newMembers) {
        const isMailSended = await sendInvitationLink(member, refferalCode);
        if (!isMailSended) {
          throw new HttpError(
            HTTP_statusCode.InternalServerError,
            "Email not sent"
          );
        }
      }
      return companyMembers;
    } catch (error: unknown) {
      throw error;
    }
  };
  inviteUser = async (admin_id: string, email: string): Promise<void> => {
    try {
      const adminData: AdminDoc | null =
        await this.adminRepository.findByAdminId(admin_id);
      if (!adminData?.companyId) {
        throw new HttpError(HTTP_statusCode.NotFound, "No Admin Data found");
      }

      const companyId: string = adminData.companyId;
      const companyData: CompanyDoc | null =
        await this.companyRepository.companyFindById(companyId);

      if (!companyData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No Company Data found");
      }

      const referralCode: string = companyData.refferalCode;
      const isMailSended = await sendInvitationLink(email, referralCode);

      if (!isMailSended) {
        throw new HttpError(
          HTTP_statusCode.InternalServerError,
          "Email not sent"
        );
      }
    } catch (error: unknown) {
      throw error;
    }
  };
  companyInfo = async (
    admin_id: string
  ): Promise<{
    companyName: string;
    userCount: number;
    projectCount: number;
    premium: string;
  }> => {
    try {
      const adminData: AdminDoc | null =
        await this.adminRepository.findByAdminId(admin_id);
      if (!adminData?.companyId) {
        throw new HttpError(HTTP_statusCode.NotFound, "No Admin Data found");
      }
      const status = "active";
      const paymentData: PaymentDoc | null =
        await this.paymentRepository.paymentStatus(admin_id, status);
      let premium: string;
      if (paymentData) {
        premium =
          paymentData.subscription.charAt(0).toUpperCase() +
          paymentData.subscription.slice(1) +
          "Premium";
      } else {
        premium = "Go Premium";
      }
      const companyId = adminData.companyId;
      const companyInfo: CompanyDoc | null =
        await this.companyRepository.companyFindById(companyId);
      if (!companyInfo) {
        throw new HttpError(HTTP_statusCode.NotFound, "No company exists");
      }
      const companyName: string = companyInfo?.companyName;
      const userCount: number = await this.userRepository.countUserDocuments(
        companyId
      );
      const projectCount: number =
        await this.projectRepository.countProjectDocuments(admin_id);
      return { companyName, userCount, projectCount, premium };
    } catch (error: unknown) {
      throw error;
    }
  };
  companyName = async (user_id: string): Promise<string> => {
    try {
      const userData: UserDoc | null = await this.userRepository.findByUserId(
        user_id
      );
      if (!userData) {
        throw new HttpError(HTTP_statusCode.NotFound, "No user data exists");
      }

      if (!userData.refferalCode) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "No referral code exists"
        );
      }

      const refferalCode = userData.refferalCode;

      const companyDetails: CompanyDoc | null =
        await this.companyRepository.companyDetailsByRefferal(refferalCode);

      if (!companyDetails) {
        throw new HttpError(HTTP_statusCode.NotFound, "No company name exists");
      }
      return companyDetails?.companyName;
    } catch (error: unknown) {
      throw error;
    }
  };
}
export default CompanyServices;
